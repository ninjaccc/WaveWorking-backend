import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { UpdateLikeDto } from './dto/update-like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  add(@Body() updateLikeDto: UpdateLikeDto) {
    const { musicId, channelId, userId } = updateLikeDto;
    return this.likesService.add(musicId, channelId, userId);
  }

  @Post('unlike')
  remove(@Body() updateLikeDto: UpdateLikeDto) {
    const { musicId, channelId, userId } = updateLikeDto;
    return this.likesService.remove(musicId, channelId, userId);
  }

  @Get()
  getAll() {
    return this.likesService.getAll();
  }
}
