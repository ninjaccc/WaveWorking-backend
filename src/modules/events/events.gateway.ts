import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';

@WebSocketGateway(8080)
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket, request: IncomingMessage) {
    console.log(request.url);
  }

  @SubscribeMessage('events')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }
}
