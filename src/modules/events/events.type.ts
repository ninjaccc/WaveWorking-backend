import { WebSocket } from 'ws';
import { MusicData, PlayData } from '../music/music.type';

export interface WebsocketWithUserInfo extends WebSocket {
  /** 客戶端隨機產生的隨機id */
  secWsKey: string;
  userId: string;
  userName: string;
  userAvatar: string;
  channelId: string;
  roleId: string;
  pageIndexOfHistory: number;
}

export interface JoinChannelEventData {
  token: string;
}

export interface AddMusicEventData {
  musicId: string;
}

export interface DeleteMusicEventData {
  _id: string;
}

export type UpdateCurrentMusicEventData = {
  _id: string;
} | null;

export interface UpdateCurrentTimeEventData {
  time: string;
}

export type InsertMusicEventData = Array<{
  _id: string;
  cancel: boolean;
  /** 是否插入至最上方 */
  top: boolean;
}>;

export interface SetPageSizeOfHistoryEventDate {
  pageSize: number;
}

export interface SetPageIndexOfHistoryEventDate {
  pageIndex: number;
}

export interface LikeMusicFromHistoryEventData {
  _id: string;
  musicId: string;
}

export interface AddMusicFromHistoryEventData {
  _id: string;
  musicId: string;
}
