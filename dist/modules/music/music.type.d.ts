export interface MusicData {
    musicId: string;
    name: string;
    author: string;
    thumbnail: string;
    duration: string;
}
export interface PlayData extends MusicData {
    likes: Record<string, boolean | null | undefined>;
    createdAt: string;
    userId: string;
    channelId: string;
    onTime: null | string;
    _id: string;
    insert?: boolean;
}
export interface AddMusicParams {
    url?: string;
    musicId?: string;
    onTime?: string;
    userId: string;
    channelId: string;
}
export interface ChannelData {
    playList: PlayData[];
    toBeAuditedList: PlayData[];
    pageSizeOfHistory: number;
}
