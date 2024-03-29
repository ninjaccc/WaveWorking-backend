import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
import { MusicModule } from '../music/music.module';
import { UsersModule } from '../users/users.module';
import { CronModule } from '../cron/cron.module';
import { EventsGateway } from './gateway/socketio.gateway';
import { ChannelsModule } from '../channels/channels.module';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [
    LikesModule,
    ChannelsModule,
    MusicModule,
    UsersModule,
    CronModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRES_DAY'),
          },
        };
      },
    }),
  ],
  providers: [EventsGateway, WsAuthGuard],
})
export class EventsModule {}
