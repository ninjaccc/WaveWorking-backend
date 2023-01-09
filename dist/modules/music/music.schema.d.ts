import mongoose, { HydratedDocument } from 'mongoose';
export declare type MusicDocument = HydratedDocument<Music>;
export declare class Music {
    musicId: string;
    name: string;
    author: string;
    url?: string;
    thumbnail: string;
    likes: Record<string, string>;
    createdAt: Date;
    duration: string;
    channelId: string;
    userId: string;
    onTime: Date;
    canBeReAddedTime: Date;
}
export declare const MusicSchema: mongoose.Schema<Music, mongoose.Model<Music, any, any, any, any>, {}, {}, {}, {}, "type", Music>;
