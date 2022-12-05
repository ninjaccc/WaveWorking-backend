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
