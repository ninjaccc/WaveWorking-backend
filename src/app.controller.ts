import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipJwtAuth } from './modules/auth/role.constant';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @SkipJwtAuth()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
