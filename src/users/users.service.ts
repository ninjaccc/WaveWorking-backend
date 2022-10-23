import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create(createUserDto);

    return newUser.save();
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: number) {
    return this.userModel.findById(id);
  }

  updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    return this.userModel.findByIdAndUpdate(id, updateProfileDto);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id?: number) {
    return this.userModel.remove(id);
  }
}
