export interface MusicData {
  musicId: string;
  name: string;
  author: string;
  thumbnail: string;
  duration: string;
}

export interface MusicDataDetail extends MusicData {
  likes: string[];
  createdAt: string;
  userId: string;
  channelId: string;
  onTime: null | string;
  _id: string;
  __v: number;
}

export interface AddMusicParams {
  url?: string;
  musicId?: string;
  onTime?: string;
  userId: string;
  channelId: string;
}

/** 當前頻道資訊佔存 */
export interface ChannelData {
  /** 之後需要被撥放的清單列表 */
  toBePlayedList: MusicDataDetail[];
  /** dj待審核插播音樂id列表 */
  toBeAuditedList: MusicDataDetail[];
  /** 插播歌單列表 */
  insertPlayList: MusicDataDetail[];
  /** 當前撥放的音樂的資訊 */
  currentPlay?: {
    isStop: boolean;
    /** 是否重複撥放? */
    repeat: boolean;
  };
}
