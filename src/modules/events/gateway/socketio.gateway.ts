import { v4 as uuidv4 } from 'uuid';
import { remove, findLastIndex } from 'lodash';
import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { WsAuthGuard } from 'src/modules/auth/guards/ws-auth.guard';
import { Role, Roles } from 'src/modules/auth/role.constant';
import { MusicService } from 'src/modules/music/music.service';
import { ChannelData, PlayData } from 'src/modules/music/music.type';
import {
  AddMusicEventData,
  DeleteMusicEventData,
  InsertMusicEventData,
  JoinChannelEventData,
  UpdateCurrentMusicEventData,
  UpdateCurrentTimeEventData,
  SetPageSizeOfHistoryEventDate,
  SetPageIndexOfHistoryEventDate,
  AddMusicFromHistoryEventData,
  LikeMusicFromHistoryEventData,
} from '../events.type';
import { UsersService } from 'src/modules/users/users.service';
import { CronService } from 'src/modules/cron/cron.service';
import { ChannelsService } from 'src/modules/channels/channels.service';

interface WebsocketWithUserInfo extends Socket {
  secWsKey: string;
  userId: string;
  userName: string;
  userAvatar: string;
  channelId: string;
  roleId: string;
  pageIndexOfHistory: number;
}

interface DecodeData {
  id: string;
  channelId: string;
  roleId: string;
  iat: number;
  exp: number;
}

const DEFAULT_PAGE_SIZE_OF_HISTORY = 10;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  /**
   * 頻道資訊緩存
   */
  channelCache: Record<string, ChannelData> = {};

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private cronService: CronService,
    private musicService: MusicService,
    private channelService: ChannelsService,
  ) {}

  /** 有人連進來的時候觸發 */
  handleConnection(client: WebsocketWithUserInfo, request: IncomingMessage) {
    console.log(`有人進來摟: ${client.id}`);
    // #TODO request.socket.remoteAddress可以取得客戶端ip
    client.send(
      JSON.stringify({
        event: 'connect',
        // data: 'success',
        data: client.id,
      }),
    );
  }

  handleDisconnect(client: WebsocketWithUserInfo) {
    // #TODO 判斷用戶關閉網站後，如何知道是該userId離開頻道
    // console.log(client);
  }

  @SubscribeMessage('join-channel')
  async joinChannel(client: WebsocketWithUserInfo, data: JoinChannelEventData) {
    const token = data.token;

    const decodeData: DecodeData = await this.jwtService.verifyAsync(token);
    const { channelId } = decodeData;

    await Promise.all([
      this.saveInfoToWebsocketClient(client, decodeData),
      this.initChannelCache(channelId),
    ]);

    client.join(channelId);
    client
      .to(channelId)
      .emit(`使用者${client.userId}已經進入${client.channelId}頻道`);

    // send playlist to user
    client.emit(
      'update-playlist',
      this.channelCache[channelId].playList.map((item) =>
        this.toClientFormat(item),
      ),
    );

    // send history to user
    const historyData = await this.getHistory(channelId, 1);
    client.emit('update-history', historyData);

    // dj need current audited list
    if (Number(client.roleId) === Role.Manager) {
      const toBeAuditedList = this.channelCache[channelId].toBeAuditedList;
      client.emit(
        'update-audited-list',
        toBeAuditedList.map((item) => {
          const { name, author, createdAt, _id, thumbnail, duration } = item;
          return {
            name,
            author,
            createdAt,
            _id,
            thumbnail,
            duration,
          };
        }),
      );
    }
  }

  /** 某使用者新增歌曲至當前撥放清單 */
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('add-music')
  async addMusic(client: WebsocketWithUserInfo, data: AddMusicEventData) {
    const { userId, channelId } = client;
    const playData = await this.generatePlayData(
      data.musicId,
      userId,
      channelId,
    );

    this.channelCache[channelId].playList.push(playData);
    this.server.to(channelId).emit(
      'update-playlist',
      this.channelCache[channelId].playList.map((item) =>
        this.toClientFormat(item),
      ),
    );
  }

  @Roles(Role.Manager)
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('delete-music')
  async deleteMusic(client: WebsocketWithUserInfo, data: DeleteMusicEventData) {
    const channelId = client.channelId;

    remove(
      this.channelCache[channelId].playList,
      (item) => item._id === data._id,
    );

    this.server.to(channelId).emit(
      'update-playlist',
      this.channelCache[channelId].playList.map((item) =>
        this.toClientFormat(item),
      ),
    );
  }

  /** 使用者申請插播至歌單 */
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('apply-to-insert-music')
  async applyToInsertMusic(
    client: WebsocketWithUserInfo,
    data: AddMusicEventData,
  ) {
    const { userId, channelId } = client;
    const playData = await this.generatePlayData(
      data.musicId,
      userId,
      channelId,
    );

    this.channelCache[channelId].toBeAuditedList.push(playData);

    const djClient = await this.findDjClientInChannel(channelId);
    console.log(djClient);
    if (!djClient) return;

    djClient.emit(
      'update-audited-list',
      this.channelCache[channelId].toBeAuditedList.map((item) => {
        const { name, author, createdAt, _id, thumbnail, duration } = item;
        return {
          name,
          author,
          createdAt,
          _id,
          thumbnail,
          duration,
        };
      }),
    );
  }

  @Roles(Role.Manager)
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('insert-music')
  async insertMusic(client: WebsocketWithUserInfo, data: InsertMusicEventData) {
    const { toBeAuditedList } = this.channelCache[client.channelId];

    // remove those music from toBeAuditedList, and get those to handle after
    const toBeInsertMusicList = remove(toBeAuditedList, (item) => {
      return data.find((d) => d._id === item._id);
    })
      .filter((item, index) => !data[index].cancel)
      // 越早插入的會在清單越下面，所以此處要反轉
      .reverse()
      .map((item) => {
        const { userId, channelId, musicId, _id } = item;
        return {
          userId,
          channelId,
          musicId,
          _id,
        };
      });

    if (toBeInsertMusicList.length) {
      /** 需要被插入至最前面的音樂id列表 */
      const needTopIndex = data
        .filter((item) => item.top)
        .map((item) =>
          toBeInsertMusicList.findIndex((i) => i._id === item._id),
        );
      this.insertMusicListAndSend(toBeInsertMusicList, needTopIndex);
    }

    // update audited list for dj
    client.emit(
      'update-audited-list',
      this.channelCache[client.channelId].toBeAuditedList.map((item) => {
        const { name, author, createdAt, _id, thumbnail, duration } = item;
        return {
          name,
          author,
          createdAt,
          _id,
          thumbnail,
          duration,
        };
      }),
    );
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('update-current-music')
  async updateCurrentMusic(
    client: WebsocketWithUserInfo,
    data: UpdateCurrentMusicEventData,
  ) {
    const channelId = client.channelId;

    // 存入音樂歷史紀錄
    const currentPlay = this.channelCache[channelId].playList?.[0];
    if (currentPlay) {
      const { musicId, onTime, userId, channelId } = currentPlay;
      await this.musicService.add({ musicId, onTime, userId, channelId });
      // 更新歷史紀錄
      const endIndex = await this.getLastPageIndexOfHistory(channelId);
      this.sendHistoryOnAChannel(channelId, endIndex);
    }

    // 如果更新的音樂為空，表示目前播放清單上沒有任何歌曲
    if (!data) {
      this.channelCache[channelId].playList = [];
      this.sendPlaylistOnAChannel(channelId);
      return;
    }

    // 移除第一項(原本的播放項)
    this.channelCache[channelId].playList.shift();

    const [currentMusic] = remove(
      this.channelCache[channelId].playList,
      (item) => item._id === data._id,
    );

    if (!currentMusic) {
      throw new HttpException('cant find this music!!', 404);
    }

    this.channelCache[channelId].playList.unshift({ ...currentMusic });
    this.sendPlaylistOnAChannel(channelId);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('update-current-time')
  async updateCurrentTime(
    client: WebsocketWithUserInfo,
    data: UpdateCurrentTimeEventData,
  ) {
    this.server.in(client.channelId).emit('update-current-time', data);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('like')
  async likeMusic(client: WebsocketWithUserInfo, data: AddMusicEventData) {
    this.likeMusicAndSend(client.userId, data.musicId, true, client.channelId);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('unlike')
  async unlikeMusic(client: WebsocketWithUserInfo, data: AddMusicEventData) {
    this.likeMusicAndSend(client.userId, data.musicId, false, client.channelId);
  }

  @Roles(Role.Manager)
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('set-page-size-of-history')
  async setPageSizeOfHistory(
    client: WebsocketWithUserInfo,
    data: SetPageSizeOfHistoryEventDate,
  ) {
    const { channelId } = client;
    this.channelCache[channelId].pageSizeOfHistory = data.pageSize;
    // 若DJ設置新的pageSize，則所有人接收到新的第一頁列表
    this.sendHistoryOnAChannel(channelId, 1);
  }

  /** 設置當前client歷史紀錄位於第幾頁 */
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('set-page-index-of-history')
  async setPageIndexOfHistory(
    client: WebsocketWithUserInfo,
    data: SetPageIndexOfHistoryEventDate,
  ) {
    const { channelId } = client;
    client.pageIndexOfHistory = data.pageIndex;
    this.sendHistoryToUser(client, channelId, data.pageIndex);
  }

  async likeMusicAndSend(
    userId: string,
    musicId: string,
    like: boolean,
    channelId: string,
  ) {
    this.channelCache[channelId].playList
      .filter((item) => item.musicId === musicId)
      .forEach((item) => (item.likes[userId] = like));
    this.sendPlaylistOnAChannel(channelId);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('add-music-from-history')
  async AddMusicFromHistory(
    client: WebsocketWithUserInfo,
    data: AddMusicFromHistoryEventData,
  ) {
    // 加入至playlist
    await this.addMusic(client, { musicId: data.musicId });

    // 增加下一次可重新被添加至歌單的時間
    const date = new Date();
    // #TODO 之後會改為增加24小時時間
    date.setMinutes(date.getMinutes() + 1);
    await this.musicService.findByIdAndUpdate(data._id, {
      canBeReAddedTime: date,
    });

    // 更新此頁歷史紀錄至該頻道
    this.sendHistoryOnAChannel(client.channelId, client.pageIndexOfHistory);

    // 加入排程，隔1分鐘後觸發(1分鐘為測試，之後會改成24小時後)
    this.cronService.addSpecificTimeJob(
      `can be added again until ${date.toString()} `,
      date,
      async () => {
        await this.musicService.findByIdAndUpdate(data._id, {
          canBeReAddedTime: null,
        });
        this.sendHistoryOnAChannel(client.channelId, client.pageIndexOfHistory);
      },
    );
  }

  sendPlaylistOnAChannel(channelId: string) {
    this.server.in(channelId).emit(
      'update-playlist',
      this.channelCache[channelId].playList.map((item) =>
        this.toClientFormat(item),
      ),
    );
  }

  async getHistoryData(channelId: string, pageIndex: number) {
    const pageSize = this.channelCache[channelId].pageSizeOfHistory;
    const [musicTotalCount, musicList] = await Promise.all([
      this.musicService.getTotalCount(),
      this.musicService.getByQuery(
        {
          channelId,
        },
        {
          skip: (Number(pageIndex) - 1) * Number(pageSize),
          limit: Number(pageSize),
          sort: { createdAt: 'asc' },
        },
      ),
    ]);

    return {
      pageIndex,
      totalCount: musicTotalCount,
      pageCount: Math.ceil(musicTotalCount / pageSize),
      list: musicList,
    };
  }

  async sendHistoryToUser(
    client: WebsocketWithUserInfo,
    channelId: string,
    pageIndex: number,
  ) {
    const historyData = await this.getHistoryData(channelId, pageIndex);

    client.emit('update-history', historyData);
  }

  async sendHistoryOnAChannel(channelId: string, pageIndex: number) {
    const historyData = await this.getHistoryData(channelId, pageIndex);

    this.server.in(channelId).emit('update-history', historyData);
  }

  /**
   * 取得歷史紀錄最後一頁位於第幾頁。
   * 注意 : pageIndex最小值為1
   */
  async getLastPageIndexOfHistory(channelId: string) {
    const pageSize = this.channelCache[channelId].pageSizeOfHistory;
    const total = await this.musicService.getTotalCount();

    return Math.floor(total / pageSize) + 1;
  }

  // #FIX 邏輯需要再調整
  async insertMusicListAndSend(
    items: Array<{
      userId: string;
      channelId: string;
      musicId: string;
    }>,
    needTopIndex: number[],
  ) {
    const insertIndex = () => {
      if (!this.channelCache[channelId].playList.length) return 0;

      const index = findLastIndex(
        this.channelCache[channelId].playList,
        (item) => item.insert,
      );

      // 找不到有插播的歌，就插序號0
      return index === -1 ? 1 : index + 1;
    };
    const channelId = items[0].channelId;
    const playDataList = await Promise.all(
      items.map((item) => {
        const { musicId, userId, channelId } = item;
        return this.generatePlayData(musicId, userId, channelId);
      }),
    );

    /** 需要被插入至最前面(扣掉當前撥放項目)的列表 */
    const listNeedToBeInsertedToTop = playDataList.filter((item, index) =>
      needTopIndex.includes(index),
    );

    /** 插入至最後一個插播項目之後的列表 */
    const listNeedToBeInsertedAfterTheLastInsertedItem = playDataList.filter(
      (item, index) => !needTopIndex.includes(index),
    );

    // 如果列表有要求插入至最前面的情況
    if (listNeedToBeInsertedToTop.length) {
      this.channelCache[channelId].playList.splice(
        this.channelCache[channelId].playList.length ? 1 : 0,
        0,
        ...listNeedToBeInsertedToTop.map((item) => ({ ...item, insert: true })),
      );
    }

    this.channelCache[channelId].playList.splice(
      insertIndex(),
      0,
      ...listNeedToBeInsertedAfterTheLastInsertedItem.map((item) => ({
        ...item,
        insert: true,
      })),
    );

    this.server.to(channelId).emit(
      'update-playlist',
      this.channelCache[channelId].playList.map((item) =>
        this.toClientFormat(item),
      ),
    );
  }

  async findDjClientInChannel(channelId: string) {
    const sockets = await this.server.in(channelId).fetchSockets();

    return sockets.find((item) => {
      const i = item as unknown as WebsocketWithUserInfo;

      return (
        (i.roleId as unknown as Role) === Role.Manager &&
        i.channelId === channelId
      );
    }) as unknown as WebsocketWithUserInfo | undefined;
    // sockets.find(s => s)
    // this.channelService.getManagerId(channelId)
    // return Array.from(this.server.clients).find(
    //   (item) =>
    //     (item.roleId as unknown as Role) === Role.Manager &&
    //     item.channelId === channelId,
    // );
  }

  async generatePlayData(musicId: string, userId: string, channelId: string) {
    const musicData = await this.musicService.getInfoById(musicId);

    return {
      ...musicData,
      userId,
      likes: {},
      channelId,
      createdAt: Date.now().toString(),
      onTime: null,
      // 暫時的流水號id，之後真正審核通過被加入music collection再依靠mongoose創建的新id取代
      _id: uuidv4(),
    } as PlayData;
  }

  async getHistory(channelId: string, pageIndex: number) {
    const pageSize = this.channelCache[channelId].pageSizeOfHistory;
    const [musicTotalCount, musicList] = await Promise.all([
      this.musicService.getTotalCount(),
      this.musicService.getByQuery(
        {
          channelId,
        },
        {
          skip: (Number(pageIndex) - 1) * Number(pageSize),
          limit: Number(pageSize),
          sort: { createdAt: 'asc' },
        },
      ),
    ]);

    return {
      pageIndex,
      totalCount: musicTotalCount,
      pageCount: Math.ceil(musicTotalCount / pageSize),
      list: musicList,
    };
  }

  async saveInfoToWebsocketClient(
    client: WebsocketWithUserInfo,
    decodeData: DecodeData,
  ) {
    const { id, channelId, roleId } = decodeData;
    client.channelId = channelId;
    client.roleId = roleId;
    client.userId = id;

    const userData = await this.userService.findById(id);
    client.userName = userData.name;
    client.userAvatar = userData.avatar;
  }

  async initChannelCache(channelId: string) {
    if (!this.channelCache[channelId]) {
      const managerId = await this.channelService.getManagerId(channelId);

      this.channelCache[channelId] = {
        playList: [],
        toBeAuditedList: [],
        pageSizeOfHistory: DEFAULT_PAGE_SIZE_OF_HISTORY,
        managerId,
      };
    }
  }

  /** 移除客戶端不需要的資料，並回傳 */
  toClientFormat(data: PlayData) {
    const {
      name,
      author,
      createdAt,
      _id,
      thumbnail,
      duration,
      insert,
      musicId,
      likes,
    } = data;

    return {
      name,
      author,
      createdAt,
      _id,
      musicId,
      thumbnail,
      duration,
      insert: !!insert,
      likes,
    };
  }
}
