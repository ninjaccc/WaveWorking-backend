import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Channel, ChannelDocument } from './channel.schema';
import { AddChannelDto } from './dto/add-channel.dto';
import { JoinChannelAsDjDto } from './dto/join-channel-as-dj.dto';
import { JoinChannelAsGuestDto } from './dto/join-channel-as-guest.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/role.constant';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    private authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async add(addChannelDto: AddChannelDto) {
    const { name, thumbnail, password, managerId } = addChannelDto;
    const correctPassword = password ? await bcrypt.hash(password, 12) : '';
    const newChannel = await this.channelModel.create({
      name,
      createdAt: Date.now(),
      password: correctPassword,
      managerId,
      thumbnail:
        thumbnail || 'https://cdn-icons-png.flaticon.com/128/4185/4185501.png',
    });

    return newChannel.save();
  }

  async guestJoin(joinChannelAsGuestDto: JoinChannelAsGuestDto) {
    const { name, channelId, channelPassword } = joinChannelAsGuestDto;

    try {
      const existUser = await this.userService.findOne({ name });
      if (existUser) {
        throw new Error('user name is exist, please change one!');
      }

      const currentChannel = await this.getChannelById(channelId);
      if (!currentChannel) {
        throw new Error('can not find this channel!');
      }

      const realChannelPassword = currentChannel.password;
      const isPasswordCorrect = await bcrypt.compare(
        channelPassword,
        realChannelPassword,
      );

      if (!isPasswordCorrect) {
        throw new Error('password is not correct');
      }

      const guestUser = await this.userService.create({
        name,
        email: uuidv4(),
        password: 'unknownPassword',
        gender: 1,
        roleId: Role.Guest,
      });

      const token = this.jwtService.sign(
        {
          id: guestUser._id,
          roleId: guestUser.roleId,
          channelId: currentChannel._id,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_DAY,
        },
      );

      return { token };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async djJoin(joinChannelAsDjDto: JoinChannelAsDjDto) {
    const { email, password, channelId } = joinChannelAsDjDto;

    try {
      const currentUser = await this.authService.validateUser(email, password);
      const channel = await this.channelModel.findById(channelId);
      if (!channel) {
        throw new Error('cant find this channel!');
      }

      const token = this.jwtService.sign(
        {
          id: currentUser._id,
          roleId: currentUser.roleId,
          channelId: channel._id,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_DAY,
        },
      );

      return { token };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getManagerId(channelId: string) {
    try {
      const channel = await this.channelModel.findById(channelId);
      console.log(channel);
      return channel.managerId;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  getChannelById(channelId: string) {
    return this.channelModel.findById(channelId);
  }

  /** 取得頻道列表，僅包含客戶端需要知道之資訊 */
  async getChannelInfoList() {
    const channelList = await this.channelModel
      .find()
      .where()
      .select('-createdAt');
    return channelList.map((channel) => {
      const { _id, name, thumbnail } = channel;
      return {
        _id,
        name,
        thumbnail,
        isLock: !!channel.password,
      };
    });
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
