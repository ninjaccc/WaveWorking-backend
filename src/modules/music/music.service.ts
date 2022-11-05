import { HttpException, Injectable } from '@nestjs/common';
import { AddMusicUrlDto } from './dto/add-music-url.dto';
import { AddMusicUrlOnTimeDto } from './dto/add-music-url-on-time.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Music, MusicDocument } from './music.schema';
import { Model } from 'mongoose';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable()
export class MusicService {
  constructor(
    @InjectModel(Music.name) private musicModel: Model<MusicDocument>,
    private youtubeService: YoutubeService,
  ) {}

  searchByQuery(query: Record<string, string>) {
    const { q } = query;
    if (!q)
      throw new HttpException('should pass string with q, e.g. q=music', 404);

    return this.youtubeService.searchByQuery(q);
  }

  getInfoById(id: string) {
    return this.youtubeService.getInfoByVideoIds([id]);
  }
}
