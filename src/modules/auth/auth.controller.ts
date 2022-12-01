import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SkipJwtAuth } from './role.constant';

@ApiTags('登入驗證')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
}
