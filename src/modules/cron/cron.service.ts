import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  /** 加入指定時間執行的任務 */
  addSpecificTimeJob(
    name: string,
    date: Date,
    callback: (...args: any[]) => void,
  ) {
    const job = new CronJob(date, () => {
      callback();
      // 指定時間執行的任務一旦結束就刪除該任務
      this.schedulerRegistry.deleteCronJob(name);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }
}
