import { SchedulerRegistry } from '@nestjs/schedule';
export declare class CronService {
    private schedulerRegistry;
    constructor(schedulerRegistry: SchedulerRegistry);
    addSpecificTimeJob(name: string, date: Date, callback: (...args: any[]) => void): void;
}
