import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { AddMusicByUrlOrIdDto } from './dto/add-music-by-url-or-id.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role, Roles } from '../auth/role.constant';

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

  /* Add music, and return this music info. only admin can access this api directly */
  /*--------------------------------------------*/
  @Roles(Role.Admin)
  @Post()
  async addByUrlOrId(
    @Body() addMusicByUrlOrIdDto: AddMusicByUrlOrIdDto,
    @Request() req,
  ) {
    const { id: musicId, url } = addMusicByUrlOrIdDto;
    const { user } = req;
    const { id: userId, channelId } = user;
    return this.musicService.add({
      userId,
      channelId,
      musicId,
      url: url,
    });
  }

  @Get(':id')
  getInfo(@Param('id') id: string) {
    return this.musicService.getInfoById(id);
  }

  @Roles(Role.Admin)
  @Get()
  getAll() {
    return this.musicService.getAll();
  }

  @Roles(Role.Admin)
  @Delete()
  removeAll() {
    return this.musicService.removeAll();
  }
}
