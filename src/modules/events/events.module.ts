import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
import { MusicModule } from '../music/music.module';
import { UsersModule } from '../users/users.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    MusicModule,
    UsersModule,
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
