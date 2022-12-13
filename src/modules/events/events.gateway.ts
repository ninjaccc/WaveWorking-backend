import { v4 as uuidv4 } from 'uuid';
import { remove } from 'lodash';
import { Injectable, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { Server } from 'ws';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
import { Role, Roles } from '../auth/role.constant';
import { MusicService } from '../music/music.service';
import { ChannelData, MusicDataDetail } from '../music/music.type';
import {
  AddMusicEventData,
  InsertMusicEventData,
  JoinChannelEventData,
  WebsocketWithUserInfo,
} from './events.type';
import { UsersService } from '../users/users.service';

interface DecodeData {
  id: string;
  channelId: string;
  roleId: string;
  iat: number;
  exp: number;
}

@WebSocketGateway()
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<WebsocketWithUserInfo>;

  /**
   * 頻道資訊緩存
   */
  channelCache: Record<string, ChannelData> = {};

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private musicService: MusicService,
  ) {}

  /** 有人連進來的時候觸發 */
  handleConnection(client: WebsocketWithUserInfo, request: IncomingMessage) {
    // #TODO request.socket.remoteAddress可以取得客戶端ip
    client.send(
      JSON.stringify({
        event: 'connect',
        data: 'success',
      }),
    );
  }

  handleDisconnect(client: WebsocketWithUserInfo) {
    // #TODO 判斷用戶關閉網站後，如何知道是該userId離開頻道
    console.log(client.url);
  }

  @SubscribeMessage('join-channel')
  async joinChannel(client: WebsocketWithUserInfo, data: JoinChannelEventData) {
    const token = data.token;
    const decodeData: DecodeData = await this.jwtService.verifyAsync(token);

    const { channelId } = decodeData;

    await this.saveInfoToWebsocketClient(client, decodeData);
    this.initChannelCache(channelId);

    this.server.clients.forEach((single) => {
      single.send(
        JSON.stringify(`使用者${client.userId}已經進入${client.channelId}頻道`),
      );
    });

    this.sendToUser(
      client.userId,
      this.channelCache[channelId].toBePlayedList,
      'update-playlist',
    );

    this.sendToUser(
      client.userId,
      this.channelCache[channelId].insertPlayList,
      'update-inserted-list',
    );

    // 如果當前進入頻道的是dj
    if (Number(client.roleId) === Role.Manager) {
      const toBeAuditedList = this.channelCache[channelId].toBeAuditedList;
      this.sendToUser(
        client.userId,
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
        'update-audited-list',
      );
    }
  }

  /** 某使用者新增歌曲至當前撥放清單 */
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('add-music')
  async addMusic(client: WebsocketWithUserInfo, data: AddMusicEventData) {
    const { userId, channelId } = client;

    this.addMusicAndSend(userId, channelId, data.musicId);
  }

  /** 使用者申請插播至歌單 */
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('apply-to-insert-music')
  async applyToInsertMusic(
    client: WebsocketWithUserInfo,
    data: AddMusicEventData,
  ) {
    const { userId, channelId } = client;
    const musicData = await this.musicService.getInfoById(data.musicId);

    const musicDataWithDetail: MusicDataDetail = {
      ...musicData,
      userId,
      likes: [],
      channelId,
      createdAt: Date.now().toString(),
      onTime: null,
      // 暫時的流水號id，之後真正審核通過被加入music collection再依靠mongoose創建的新id取代
      _id: uuidv4(),
      __v: 0,
    };

    this.channelCache[channelId].toBeAuditedList.push(musicDataWithDetail);

    const djClient = this.findDjClientInChannel(channelId);
    if (!djClient) return;

    djClient.send(
      JSON.stringify({
        event: 'update-audited-list',
        data: this.channelCache[channelId].toBeAuditedList.map((item) => {
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
      .map((item) => {
        const { userId, channelId, musicId } = item;
        return {
          userId,
          channelId,
          musicId,
        };
      });

    // update audited list for dj
    client.send(
      JSON.stringify({
        event: 'update-audited-list',
        data: this.channelCache[client.channelId].toBeAuditedList.map(
          (item) => {
            const { name, author, createdAt, _id, thumbnail, duration } = item;
            return {
              name,
              author,
              createdAt,
              _id,
              thumbnail,
              duration,
            };
          },
        ),
      }),
    );

    if (toBeInsertMusicList.length) {
      this.insertMusicListAndSend(toBeInsertMusicList);
    }
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

  initChannelCache(channelId: string) {
    if (!this.channelCache[channelId]) {
      this.channelCache[channelId] = {
        toBePlayedList: [],
        toBeAuditedList: [],
        insertPlayList: [],
      };
    }
  }

  async addMusicAndSend(userId: string, channelId: string, musicId: string) {
    const newMusic = await this.musicService.add({
      userId,
      channelId,
      musicId,
    });

    this.channelCache[channelId].toBePlayedList.push(newMusic);
    this.sendOnAChannel(
      channelId,
      this.channelCache[channelId].toBePlayedList,
      'update-playlist',
    );
  }

  async insertMusicListAndSend(
    items: Array<{
      userId: string;
      channelId: string;
      musicId: string;
    }>,
  ) {
    const channelId = items[0].channelId;
    const newMusicList = await Promise.all(
      items.map((item) => this.musicService.add(item)),
    );

    this.channelCache[channelId].insertPlayList.push(...newMusicList);
    this.sendOnAChannel(
      channelId,
      this.channelCache[channelId].insertPlayList.map((item) => {
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
      'update-inserted-list',
    );
  }

  sendAll(data: any) {
    this.server.clients.forEach((single) => {
      single.send(JSON.stringify(data));
    });
  }

  sendToUser(userId: string, data: any, event: string) {
    const currentClient = this.findClientByUser(userId);
    if (currentClient) {
      currentClient.send(JSON.stringify({ event, data }));
    }
  }

  sendOnAChannel(channelId: string, data: any, event: string) {
    this.filterClientsByChannel(channelId).forEach((client) =>
      client.send(
        JSON.stringify({
          event,
          data,
        }),
      ),
    );
  }

  filterClientsByChannel(channelId: string) {
    return Array.from(this.server.clients).filter(
      (client) => client.channelId === channelId,
    );
  }

  findDjClientInChannel(channelId: string) {
    return Array.from(this.server.clients).find(
      (item) =>
        (item.roleId as unknown as Role) === Role.Manager &&
        item.channelId === channelId,
    );
  }

  findClientByUser(userId: string) {
    return Array.from(this.server.clients).find(
      (client) => client.userId === userId,
    );
  }
}
