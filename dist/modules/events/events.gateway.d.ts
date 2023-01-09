/// <reference types="node" />
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { Server } from 'ws';
import { MusicService } from '../music/music.service';
import { ChannelData, PlayData } from '../music/music.type';
import { AddMusicEventData, DeleteMusicEventData, InsertMusicEventData, JoinChannelEventData, WebsocketWithUserInfo, UpdateCurrentMusicEventData, UpdateCurrentTimeEventData, SetPageSizeOfHistoryEventDate, SetPageIndexOfHistoryEventDate, AddMusicFromHistoryEventData } from './events.type';
import { UsersService } from '../users/users.service';
import { CronService } from '../cron/cron.service';
interface DecodeData {
    id: string;
    channelId: string;
    roleId: string;
    iat: number;
    exp: number;
}
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private userService;
    private jwtService;
    private cronService;
    private musicService;
    server: Server<WebsocketWithUserInfo>;
    channelCache: Record<string, ChannelData>;
    constructor(userService: UsersService, jwtService: JwtService, cronService: CronService, musicService: MusicService);
    handleConnection(client: WebsocketWithUserInfo, request: IncomingMessage): void;
    handleDisconnect(client: WebsocketWithUserInfo): void;
    joinChannel(client: WebsocketWithUserInfo, data: JoinChannelEventData): Promise<void>;
    addMusic(client: WebsocketWithUserInfo, data: AddMusicEventData): Promise<void>;
    deleteMusic(client: WebsocketWithUserInfo, data: DeleteMusicEventData): Promise<void>;
    applyToInsertMusic(client: WebsocketWithUserInfo, data: AddMusicEventData): Promise<void>;
    insertMusic(client: WebsocketWithUserInfo, data: InsertMusicEventData): Promise<void>;
    updateCurrentMusic(client: WebsocketWithUserInfo, data: UpdateCurrentMusicEventData): Promise<void>;
    updateCurrentTime(client: WebsocketWithUserInfo, data: UpdateCurrentTimeEventData): Promise<void>;
    likeMusic(client: WebsocketWithUserInfo, data: AddMusicEventData): Promise<void>;
    unlikeMusic(client: WebsocketWithUserInfo, data: AddMusicEventData): Promise<void>;
    setPageSizeOfHistory(client: WebsocketWithUserInfo, data: SetPageSizeOfHistoryEventDate): Promise<void>;
    setPageIndexOfHistory(client: WebsocketWithUserInfo, data: SetPageIndexOfHistoryEventDate): Promise<void>;
    AddMusicFromHistory(client: WebsocketWithUserInfo, data: AddMusicFromHistoryEventData): Promise<void>;
    generatePlayData(musicId: string, userId: string, channelId: string): Promise<PlayData>;
    saveInfoToWebsocketClient(client: WebsocketWithUserInfo, decodeData: DecodeData): Promise<void>;
    initChannelCache(channelId: string): void;
    likeMusicAndSend(userId: string, musicId: string, like: boolean, channelId: string): Promise<void>;
    insertMusicListAndSend(items: Array<{
        userId: string;
        channelId: string;
        musicId: string;
    }>, needTopIndex: number[]): Promise<void>;
    sendAll(data: any): void;
    sendToUser(userId: string, data: any, event: string): void;
    sendPlaylistToUser(userId: string, channelId: string): void;
    sendHistoryToUser(userId: string, channelId: string, pageIndex: number): Promise<void>;
    sendPlaylistOnAChannel(channelId: string): void;
    sendHistoryOnAChannel(channelId: string, pageIndex: number): Promise<void>;
    getLastPageIndexOfHistory(channelId: string): Promise<number>;
    sendOnAChannel(channelId: string, data: any, event: string): void;
    filterClientsByChannel(channelId: string): WebsocketWithUserInfo[];
    findDjClientInChannel(channelId: string): WebsocketWithUserInfo;
    findClientByUser(userId: string): WebsocketWithUserInfo;
    toClientFormat(data: PlayData): {
        name: string;
        author: string;
        createdAt: string;
        _id: string;
        musicId: string;
        thumbnail: string;
        duration: string;
        insert: boolean;
        likes: Record<string, boolean>;
    };
}
export {};
