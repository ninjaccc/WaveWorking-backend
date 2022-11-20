import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';

@WebSocketGateway()
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  /** 有人連進來的時候觸發 */
  handleConnection(client: WebSocket, request: IncomingMessage) {
    // #TODO request.socket.remoteAddress可以取得客戶端ip
    client.send(
      JSON.stringify({
        event: 'connect',
        data: 'success',
      }),
    );
  }

  handleDisconnect(client: WebSocket) {
    // #TODO 判斷用戶關閉網站後，如何知道是該userId離開頻道
    console.log(client.url);
  }

  // onEvent(client: WebSocket, data: any): Observable<WsResponse<number>> {
  @SubscribeMessage('test')
  onEvent(client: any, data: any) {
    console.log('-------------------');
    console.log(data);
    this.server.clients.forEach((single) => {
      single.send(JSON.stringify(data));
    });
    // return from([1, 2, 3]).pipe(
    //   map((item) => ({ event: 'events', data: item })),
    // );
  }
}
