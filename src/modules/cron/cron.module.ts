import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronService],
  exports: [CronService],
})

/** 定時任務模組 */
export class CronModule {}
