/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SkipJwtAuth } from './role.constant';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('登入驗證')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }
  // 參數可帶email和password
  @SkipJwtAuth()
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // 測試AuthGuard-jwt是否正常攔截錯誤的token，後續將移除
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @SkipJwtAuth()
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() { }

  @SkipJwtAuth()
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response): Promise<any> {
    if (!req.user) {
      throw new ForbiddenException('No user from google');
    }
    const user = await this.authService.validateGoogleUser(
      req.user.email,
      req.user.name
    );

    const token = this.jwtService.sign(
      {
        id: user._id,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_DAY,
      },
    );

    res.redirect(`http://localhost:5000?token=${token}`);
  }
}
