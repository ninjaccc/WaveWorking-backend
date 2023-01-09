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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { MusicService } from './music.service';
import { AddMusicByUrlOrIdDto } from './dto/add-music-by-url-or-id.dto';
export declare class MusicController {
    private readonly musicService;
    constructor(musicService: MusicService);
    search(query: Record<string, string>): Promise<import("./music.type").MusicData[]>;
    addByUrlOrId(addMusicByUrlOrIdDto: AddMusicByUrlOrIdDto, req: any): Promise<import("./music.type").PlayData>;
    getInfo(id: string): Promise<import("./music.type").MusicData>;
    getAll(): Promise<(import("mongoose").Document<unknown, any, import("./music.schema").Music> & import("./music.schema").Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    removeAll(): import("mongoose").Query<any, import("mongoose").Document<unknown, any, import("./music.schema").Music> & import("./music.schema").Music & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./music.schema").Music> & import("./music.schema").Music & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
