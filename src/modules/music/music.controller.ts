import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { AddMusicByUrlOrIdDto } from './dto/add-music-by-url-or-id.dto';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('search')
  search(@Query() query: Record<string, string>) {
    return this.musicService.searchByQuery(query);
  }

  @Post()
  async addByUrlOrId(@Body() addMusicByUrlOrIdDto: AddMusicByUrlOrIdDto) {
    return this.musicService.addByUrlOrId(addMusicByUrlOrIdDto);
  }

  // --------------------
  // use for testing
  @Get(':id')
  getInfo(@Param('id') id: string) {
    return this.musicService.getInfoById(id);
  }

  @Get()
  getAll() {
    return this.musicService.getAll();
  }

  @Delete()
  removeAll() {
    return this.musicService.removeAll();
  }
}
