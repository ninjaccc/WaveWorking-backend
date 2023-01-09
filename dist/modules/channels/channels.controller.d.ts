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
import { ChannelsService } from './channels.service';
import { AddChannelDto } from './dto/add-channel.dto';
import { JoinChannelAsDjDto } from './dto/join-channel-as-dj.dto';
import { JoinChannelAsGuestDto } from './dto/join-channel-as-guest.dto';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    getInfoList(): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        thumbnail: string;
        isLock: boolean;
    }[]>;
    joinToChannel(joinChannelAsGuestDto: JoinChannelAsGuestDto): Promise<{
        token: string;
    }>;
    joinToChannelAsDj(joinChannelAsDjDto: JoinChannelAsDjDto): Promise<{
        token: string;
    }>;
    add(addChannelDto: AddChannelDto): Promise<import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getInfo(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllDetail(): import("mongoose").Query<(import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    removeAll(): import("mongoose").Query<any, import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./channel.schema").Channel> & import("./channel.schema").Channel & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
