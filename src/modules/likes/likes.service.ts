import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument } from './likes.schema';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async getAll() {
    return this.likeModel.find();
  }

  async add(musicId: string, channelId: string, userId: string) {
    const existLike = await this.likeModel.findOne({
      music: musicId,
      channelId,
    });

    if (existLike) {
      return await existLike.updateOne(
        {
          $addToSet: {
            users: userId,
          },
        },
        { new: true },
      );
    } else {
      return await this.likeModel.create({
        channelId,
        music: musicId,
        users: [userId],
      });
    }
  }

  async remove(musicId: string, channelId: string, userId: string) {
    const existLike = await this.likeModel.findOne({
      music: musicId,
      channelId,
    });

    if (!existLike) {
      throw new HttpException('cant find this music in channel', 404);
    }

    return await existLike.updateOne(
      {
        $pull: {
          users: userId,
        },
      },
      { new: true },
    );
  }
}
