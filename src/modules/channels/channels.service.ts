import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel, ChannelDocument } from './channel.schema';
import { AddChannelDto } from './dto/add-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
  ) {}

  async add(addChannelDto: AddChannelDto) {
    const newChannel = await this.channelModel.create({
      name: addChannelDto.name,
      createdAt: Date.now(),
      image:
        addChannelDto.image ||
        'https://cdn-icons-png.flaticon.com/128/4185/4185501.png',
    });

    return newChannel.save();
  }

  // below is only use for testing
  // --------------------------------
  // --------------------------------
  // --------------------------------
  // --------------------------------
  // --------------------------------
  removeAll() {
    return this.channelModel.remove();
  }

  getById(id: string) {
    return this.channelModel.findById(id);
  }

  getAll() {
    return this.channelModel.find();
  }
}
