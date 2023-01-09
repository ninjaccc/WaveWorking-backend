/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Music, MusicDocument } from './music.schema';
import { Model } from 'mongoose';
import { YoutubeService } from '../youtube/youtube.service';
import { youtube_v3 } from 'googleapis';
import { AddMusicParams, MusicData, PlayData } from './music.type';
export declare class MusicService {
    private musicModel;
    private youtubeService;
    constructor(musicModel: Model<MusicDocument>, youtubeService: YoutubeService);
    searchByQuery(query: Record<string, string>): Promise<MusicData[]>;
    findByIdAndUpdate(id: string, updateData: Record<string, any>): import("mongoose").Query<import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getInfoById(id: string): Promise<MusicData | null>;
    getAll(): Promise<(import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getTotalCount(): Promise<number>;
    getByQuery(query: Record<string, any>, options?: {
        select?: string;
        sort?: any;
        skip?: number;
        limit?: number;
    }): Promise<(import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    add(params: AddMusicParams): Promise<PlayData>;
    getIdByUrl(url: string): string;
    create(params: AddMusicParams): Promise<PlayData>;
    transformVideoResponse(item: youtube_v3.Schema$Video): MusicData;
    findByIdAndDelete(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    removeAll(): import("mongoose").Query<any, import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Music> & Music & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
