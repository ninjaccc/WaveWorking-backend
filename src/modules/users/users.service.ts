import * as bcrypt from 'bcrypt';
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
    const hashPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = (
      await this.userModel.create({
        ...createUserDto,
        password: hashPassword,
      })
    ).toObject();
    delete user.password;
    delete user.roleId;
    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  findOne(filter: Record<string, any>) {
    return this.userModel.findOne(filter);
  }

  updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    return this.userModel.findByIdAndUpdate(id, updateProfileDto);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id?: string) {
    return this.userModel.remove(id);
  }
}
