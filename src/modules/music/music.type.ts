export interface MusicData {
  musicId: string;
  name: string;
  author: string;
  thumbnail: string;
  duration: string;
}

/** 播放項目資訊 */
export interface PlayData extends MusicData {
  /**
   * e.g.
   * {
   *    637c85907f2cb79eb4608ea3: true,
   * }
   */
  likes: Record<string, boolean | null | undefined>;
  createdAt: string;
  userId: string;
  channelId: string;
  onTime: null | string;
  _id: string;
  /** 是否為插播 */
  insert?: boolean;
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
  /** 當前撥放清單列表 */
  playList: PlayData[];
  /** dj待審核插播音樂id列表 */
  toBeAuditedList: PlayData[];
  pageSizeOfHistory: number;
}
