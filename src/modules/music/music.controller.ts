import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { AddMusicUrlDto } from './dto/add-music-url.dto';
import { AddMusicUrlOnTimeDto } from './dto/add-music-url-on-time.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('search')
  search(@Query() query: Record<string, string>) {
    return this.musicService.searchByQuery(query);
  }

  @Get(':id')
  getInfo(@Param('id') id: string) {
    return this.musicService.getInfoById(id);
  }
}
