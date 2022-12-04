import { HttpException, Injectable } from '@nestjs/common';
import { AddMusicByUrlOrIdDto } from './dto/add-music-by-url-or-id.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Music, MusicDocument } from './music.schema';
import { Model } from 'mongoose';
import { YoutubeService } from '../youtube/youtube.service';
import { youtube_v3 } from 'googleapis';
import { MusicData } from './music.type';

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

  async addByUrlOrId(addMusicByUrlOrIdDto: AddMusicByUrlOrIdDto) {
    const { url, id, onTime } = addMusicByUrlOrIdDto;
    if (!url && !id) {
      throw new HttpException('please select url or id to add music', 404);
    }

    return id ? this.addById(id, onTime) : this.addByUrl(url, onTime);
  }

  async addByUrl(url: string, onTime?: string) {
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

    return this.addById(id, onTime);
  }

  async addById(id: string, onTime?: string) {
    const info = await this.getInfoById(id);
    if (!info) {
      throw new HttpException('cant find this music!', 404);
    }

    const { id: musicId, title, author, image, duration } = info;

    const newMusic = await this.musicModel.create({
      name: title,
      musicId,
      author,
      thumbnail: image,
      duration,
      likes: [],
      createdAt: Date.now(),
      onTime: onTime ? new Date(onTime) : null,
    });

    return newMusic;
  }

  transformVideoResponse(item: youtube_v3.Schema$Video): MusicData {
    const { thumbnails, publishedAt, title, channelTitle } = item.snippet;
    const { duration } = item.contentDetails;
    return {
      title,
      author: channelTitle,
      id: item.id,
      image: thumbnails.medium.url,
      publishedAt,
      duration,
    };
  }

  // only for testing
  removeAll() {
    return this.musicModel.remove();
  }
}
