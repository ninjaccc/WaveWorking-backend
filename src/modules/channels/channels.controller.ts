import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SkipJwtAuth } from 'src/modules/auth/role.constant';
import { ChannelsService } from './channels.service';
import { AddChannelDto } from './dto/add-channel.dto';
import { JoinChannelAsDjDto } from './dto/join-channel-as-dj.dto';
import { JoinChannelAsGuestDto } from './dto/join-channel-as-guest.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  /* get all channel info for user */
  /*--------------------------------------------*/
  @SkipJwtAuth()
  @Get()
  getInfoList() {
    return this.channelsService.getChannelInfoList();
  }

  /* guest join to specific channel, and return this channel token */
  /*--------------------------------------------*/
  @SkipJwtAuth()
  @Post('/join')
  async joinToChannel(@Body() joinChannelAsGuestDto: JoinChannelAsGuestDto) {
    return this.channelsService.guestJoin(joinChannelAsGuestDto);
  }

  /* dj join to specific channel, and return this channel token */
  /*--------------------------------------------*/
  @SkipJwtAuth()
  @Post('/join-dj')
  async joinToChannelAsDj(@Body() joinChannelAsDjDto: JoinChannelAsDjDto) {
    return this.channelsService.djJoin(joinChannelAsDjDto);
  }

  /* Add channel, and return this channel info */
  /*--------------------------------------------*/
  @Post()
  async add(@Body() addChannelDto: AddChannelDto) {
    return this.channelsService.add(addChannelDto);
  }

  @SkipJwtAuth()
  @Get(':id')
  getInfo(@Param('id') id: string) {
    return this.channelsService.getById(id);
  }

  // 這支不知道為何有問題，求解
  @SkipJwtAuth()
  @Get('test')
  getAllDetail() {
    return this.channelsService.getAll();
  }

  @Delete('/system-only')
  removeAll() {
    return this.channelsService.removeAll();
  }
}
