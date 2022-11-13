import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { MusicService } from './music.service';
import { AddMusicByUrlOrIdDto } from './dto/add-music-by-url-or-id.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  /* Search music, and return music list */
  /*--------------------------------------------*/
  @Get('search')
  search(@Query() query: Record<string, string>) {
    return this.musicService.searchByQuery(query);
  }

  /* Add music, and return this music info */
  /*--------------------------------------------*/
  @Post()
  async addByUrlOrId(@Body() addMusicByUrlOrIdDto: AddMusicByUrlOrIdDto) {
    return this.musicService.addByUrlOrId(addMusicByUrlOrIdDto);
  }

  // below is only use for testing
  // --------------------------------
  // --------------------------------
  // --------------------------------
  // --------------------------------
  // --------------------------------
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
