import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<WithMongooseId<User>, 'password'>> {
    const existUser = await this.usersService
      .findOne({ email })
      .select('+password');
    if (!existUser) {
      return null;
    }

    const isAuth = await bcrypt.compare(pass, existUser.password);
    if (!isAuth) {
      return null;
    }

    const { password, ...restUser } = existUser.toObject();
    return restUser;
  }

  async validateGoogleUser(email: string, name: string) {
    const existUser = await this.usersService.findOne({ email });
    let user;
    if (!existUser) {
      user = await this.usersService.createGoogle(email, name);
    } else {
      delete existUser.password;
      delete existUser.roleId;
      user = existUser;
    }

    return user;
  }

  async login(user: any) {
    return {
      token: this.jwtService.sign(user),
    };
  }
}
