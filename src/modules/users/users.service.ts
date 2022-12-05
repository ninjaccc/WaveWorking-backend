import * as bcrypt from 'bcrypt';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { Role } from 'src/modules/auth/role.constant';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, gender } = createUserDto;
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new HttpException('exist user!', 404);
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = (
      await this.userModel.create({
        email,
        name,
        gender,
        password: hashPassword,
        roleId: createUserDto.roleId ?? Role.User,
      })
    ).toObject();
    delete user.password;
    delete user.roleId;
    return user;
  }

  async createGoogle(email: string, name: string) {
    const user = (
      await this.userModel.create({
        email,
        name,
        password: '',
        gender: 3,
        roleId: Role.User,
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
