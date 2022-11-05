import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AddChannelDto } from './dto/add-channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  /* Add channel, and return this channel info */
  /*--------------------------------------------*/
  @Post()
  async add(@Body() addChannelDto: AddChannelDto) {
    return this.channelsService.add(addChannelDto);
  }

  // below is only use for testing
  // --------------------------------
  // --------------------------------
  // --------------------------------
  // --------------------------------
  // --------------------------------
  @Get(':id')
  getInfo(@Param('id') id: string) {
    return this.channelsService.getById(id);
  }

  @Get()
  getAll() {
    return this.channelsService.getAll();
  }

  @Delete()
  removeAll() {
    return this.channelsService.removeAll();
  }
}
