"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const ws_auth_guard_1 = require("../auth/guards/ws-auth.guard");
const music_module_1 = require("../music/music.module");
const users_module_1 = require("../users/users.module");
const cron_module_1 = require("../cron/cron.module");
const events_gateway_1 = require("./events.gateway");
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            music_module_1.MusicModule,
            users_module_1.UsersModule,
            cron_module_1.CronModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    return {
                        secret: config.get('JWT_SECRET'),
                        signOptions: {
                            expiresIn: config.get('JWT_EXPIRES_DAY'),
                        },
                    };
                },
            }),
        ],
        providers: [events_gateway_1.EventsGateway, ws_auth_guard_1.WsAuthGuard],
    })
], EventsModule);
exports.EventsModule = EventsModule;
//# sourceMappingURL=events.module.js.map