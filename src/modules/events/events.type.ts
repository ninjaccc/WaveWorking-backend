import { WebSocket } from 'ws';
import { MusicData } from '../music/music.type';

export interface WebsocketWithUserInfo extends WebSocket {
  /** 客戶端隨機產生的隨機id */
  secWsKey: string;
  userId: string;
  userName: string;
  userAvatar: string;
  channelId: string;
  roleId: string;
}

export interface JoinChannelEventData {
  token: string;
}

export interface AddMusicEventData {
  musicId: string;
}

export type InsertMusicEventData = Array<{
  _id: string;
  cancel: boolean;
}>;

export type UpdatePlayListEventData = MusicData[];
