import { WebSocket } from 'ws';
export interface WebsocketWithUserInfo extends WebSocket {
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
export declare type UpdateCurrentMusicEventData = {
    _id: string;
} | null;
export interface UpdateCurrentTimeEventData {
    time: string;
}
export declare type InsertMusicEventData = Array<{
    _id: string;
    cancel: boolean;
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
