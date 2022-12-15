import { HttpException, Injectable } from '@nestjs/common';
import { AddMusicByUrlOrIdDto } from './dto/add-music-by-url-or-id.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Music, MusicDocument } from './music.schema';
import { Model } from 'mongoose';
import { YoutubeService } from '../youtube/youtube.service';
import { youtube_v3 } from 'googleapis';
import { AddMusicParams, MusicData, MusicDataDetail } from './music.type';

@Injectable()
export class MusicService {
  constructor(
    @InjectModel(Music.name) private musicModel: Model<MusicDocument>,
    private youtubeService: YoutubeService,
  ) {}

  async searchByQuery(query: Record<string, string>) {
    const { q, maxResults } = query;
    if (!q)
      throw new HttpException('should pass string with q, e.g. q=music', 404);

    if (maxResults && isNaN(Number(maxResults))) {
      throw new HttpException('maxResults should be a invalid number', 404);
    }

    const originItems = (
      await this.youtubeService.searchByQuery(q, Number(maxResults) || 12)
    ).data.items;
    return originItems.map((item) => this.transformVideoResponse(item));
  }

  async getInfoById(id: string): Promise<MusicData | null> {
    const items = (await this.youtubeService.getInfoByVideoIds([id])).data
      .items;

    // single id only have one item, so return the first
    return items.length ? this.transformVideoResponse(items[0]) : null;
  }

  async getAll() {
    return this.musicModel.find();
  }

  async add(params: AddMusicParams) {
    const { url, musicId } = params;
    if (!url && !musicId) {
      throw new HttpException('please select url or musicId to add music', 404);
    }

    const id = url && !musicId ? this.getIdByUrl(url) : musicId;
    return this.create({
      ...params,
      musicId: id,
    });
  }

  getIdByUrl(url: string) {
    if (!url.includes('youtu')) {
      throw new HttpException(
        'currently, we only have youtube link to search, please use youtube link for add music',
        404,
      );
    }
    let id: string;
    // e.g. https://www.youtube.com/watch?v=IAuRoAUV19o&ab_channel=CelineDionVEVO
    if (url.includes('watch?v=')) {
      id = url.split('watch?v=')[1].split('&')[0];
      // e.g. https://youtu.be/IAuRoAUV19o
    } else if (url.includes('youtu.be/')) {
      id = url.split('youtu.be/')[1];
    }
    return id;
  }

  async create(params: AddMusicParams) {
    const { userId, channelId, musicId, onTime } = params;
    const info = await this.getInfoById(musicId);
    if (!info) {
      throw new HttpException('cant find this music!', 404);
    }

    const { name, author, thumbnail, duration } = info;

    const res = (
      await this.musicModel.create({
        name,
        musicId,
        author,
        thumbnail,
        duration,
        userId,
        channelId,
        likes: [],
        createdAt: Date.now(),
        onTime: onTime ? new Date(onTime) : null,
      })
    ).toObject() as unknown as MusicDataDetail;

    return {
      ...res,
      // #NOTICE create出來的_id是ObjectId類型
      _id: res._id.toString(),
    } as unknown as MusicDataDetail;
  }

  transformVideoResponse(item: youtube_v3.Schema$Video): MusicData {
    const { thumbnails, title, channelTitle } = item.snippet;
    const { duration } = item.contentDetails;
    return {
      name: title,
      author: channelTitle,
      musicId: item.id,
      thumbnail: thumbnails.medium.url,
      duration,
    };
  }

  // only for testing
  removeAll() {
    return this.musicModel.remove();
  }
}
