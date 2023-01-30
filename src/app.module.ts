import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MusicModule } from './modules/music/music.module';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { EventsModule } from './modules/events/events.module';
import { AuthModule } from './modules/auth/auth.module';
import { CronModule } from './modules/cron/cron.module';
import { LikesModule } from './modules/likes/likes.module';

@Module({
  imports: [
    AuthModule,
    EventsModule,
    CacheModule.register(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${encodeURIComponent(
        process.env.MONGO_NAME,
      )}:${encodeURIComponent(
        process.env.MONGO_PASSWORD,
      )}@cluster0.q9hzcmn.mongodb.net/${encodeURIComponent(
        process.env.MONGO_DB_NAME,
      )}?retryWrites=true&w=majority`,
    ),
    UsersModule,
    MusicModule,
    YoutubeModule,
    ChannelsModule,
    CronModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
