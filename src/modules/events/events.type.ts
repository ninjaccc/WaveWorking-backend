import { WebSocket } from 'ws';

export interface WebsocketWithId extends WebSocket {
  /** 客戶端隨機產生的隨機id */
  secWsKey: string;
  userId: string;
  channelId: string;
  roleId: string;
}

export interface JoinChannelEventData {
  token: string;
}

export interface AddMusicEventData {
  musicId: string;
}
