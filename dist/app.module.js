"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./modules/users/users.module");
const music_module_1 = require("./modules/music/music.module");
const youtube_module_1 = require("./modules/youtube/youtube.module");
const channels_module_1 = require("./modules/channels/channels.module");
const events_module_1 = require("./modules/events/events.module");
const auth_module_1 = require("./modules/auth/auth.module");
const cron_module_1 = require("./modules/cron/cron.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            events_module_1.EventsModule,
            common_1.CacheModule.register(),
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRoot(`mongodb+srv://${encodeURIComponent(process.env.MONGO_NAME)}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster0.q9hzcmn.mongodb.net/${encodeURIComponent(process.env.MONGO_DB_NAME)}?retryWrites=true&w=majority`),
            users_module_1.UsersModule,
            music_module_1.MusicModule,
            youtube_module_1.YoutubeModule,
            channels_module_1.ChannelsModule,
            cron_module_1.CronModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map