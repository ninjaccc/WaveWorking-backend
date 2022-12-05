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
import { Role } from '../auth/role.constant';
import { MusicService } from '../music/music.service';
import { MusicDataDetail } from '../music/music.type';
import {
  AddMusicEventData,
  JoinChannelEventData,
  WebsocketWithId,
} from './events.type';

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
  server: Server<WebsocketWithId>;
  currentPlayList: MusicDataDetail[] = [];

  constructor(
    private jwtService: JwtService,
    private musicService: MusicService,
  ) {}

  /** 有人連進來的時候觸發 */
  handleConnection(client: WebsocketWithId, request: IncomingMessage) {
    // #TODO request.socket.remoteAddress可以取得客戶端ip
    client.send(
      JSON.stringify({
        event: 'connect',
        data: 'success',
      }),
    );
  }

  handleDisconnect(client: WebsocketWithId) {
    // #TODO 判斷用戶關閉網站後，如何知道是該userId離開頻道
    console.log(client.url);
  }

  @SubscribeMessage('join-channel')
  async joinChannel(client: WebsocketWithId, data: JoinChannelEventData) {
    const token = data.token;
    const decodeData: DecodeData = await this.jwtService.verifyAsync(token);

    const { id, channelId, roleId } = decodeData;
    client.userId = id;
    client.channelId = channelId;
    client.roleId = roleId;

    this.server.clients.forEach((single) => {
      single.send(
        JSON.stringify(`使用者${client.userId}已經進入${client.channelId}頻道`),
      );
    });
  }

  /** 某使用者新增歌曲至當前撥放清單 */
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('add-music')
  async addMusic(client: WebsocketWithId, data: AddMusicEventData) {
    const { userId, channelId } = client;

    const newMusic = await this.musicService.add({
      userId,
      channelId,
      musicId: data.musicId,
    });

    this.currentPlayList.push(newMusic);
    this.sendOnAChannel(
      channelId,
      this.getChannelPlayList(channelId),
      'update-playlist',
    );
  }

  /** dj審核准許插播至歌單 */
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('')
  insertMusic(client: WebsocketWithId, data: AddMusicEventData) {
    const id = data.musicId;

    const currentDj = Array.from(this.server.clients).find(
      (item) => (item.roleId as unknown as Role) === Role.Manager,
    );
    if (currentDj) {
      currentDj.send(
        JSON.stringify({
          event: 'insert-music',
          data: id,
        }),
      );
    }
  }

  sendAll(data: any) {
    this.server.clients.forEach((single) => {
      single.send(JSON.stringify(data));
    });
  }

  sendOnAChannel(channelId: string, data: any, event: string) {
    Array.from(this.server.clients)
      .filter((client) => client.channelId === channelId)
      .forEach((client) =>
        client.send(
          JSON.stringify({
            event,
            data,
          }),
        ),
      );
  }

  getChannelPlayList(channelId: string) {
    return this.currentPlayList.filter((item) => item.channelId === channelId);
  }
}
