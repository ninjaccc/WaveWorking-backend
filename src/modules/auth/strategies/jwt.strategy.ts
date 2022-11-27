import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory } from '@nestjs/core';
import { User } from 'src/modules/users/user.schema';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    // https://github.com/mikenicholson/passport-jwt#configure-strategy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { userId: string; iat: number; exp: number }) {
    const existUser = await this.usersService.findById(payload.userId);
    if (!existUser) {
      throw new UnauthorizedException();
    }
    const { password, ...restUser } = existUser.toObject();
    return restUser;
  }
}
