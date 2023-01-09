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
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Channel, ChannelDocument } from './channel.schema';
import { AddChannelDto } from './dto/add-channel.dto';
import { JoinChannelAsDjDto } from './dto/join-channel-as-dj.dto';
import { JoinChannelAsGuestDto } from './dto/join-channel-as-guest.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
export declare class ChannelsService {
    private channelModel;
    private authService;
    private userService;
    private jwtService;
    constructor(channelModel: Model<ChannelDocument>, authService: AuthService, userService: UsersService, jwtService: JwtService);
    add(addChannelDto: AddChannelDto): Promise<import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    guestJoin(joinChannelAsGuestDto: JoinChannelAsGuestDto): Promise<{
        token: string;
    }>;
    djJoin(joinChannelAsDjDto: JoinChannelAsDjDto): Promise<{
        token: string;
    }>;
    getChannelById(channelId: string): import("mongoose").Query<import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getChannelInfoList(): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        thumbnail: string;
        isLock: boolean;
    }[]>;
    removeAll(): import("mongoose").Query<any, import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getById(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAll(): import("mongoose").Query<(import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Channel> & Channel & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
