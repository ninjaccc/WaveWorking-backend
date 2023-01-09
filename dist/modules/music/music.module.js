"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicModule = void 0;
const common_1 = require("@nestjs/common");
const music_service_1 = require("./music.service");
const music_controller_1 = require("./music.controller");
const mongoose_1 = require("@nestjs/mongoose");
const music_schema_1 = require("./music.schema");
const youtube_module_1 = require("../youtube/youtube.module");
let MusicModule = class MusicModule {
};
MusicModule = __decorate([
    (0, common_1.Module)({
        imports: [
            youtube_module_1.YoutubeModule,
            mongoose_1.MongooseModule.forFeature([
                {
                    name: music_schema_1.Music.name,
                    schema: music_schema_1.MusicSchema,
                },
            ]),
        ],
        controllers: [music_controller_1.MusicController],
        providers: [music_service_1.MusicService],
        exports: [music_service_1.MusicService],
    })
], MusicModule);
exports.MusicModule = MusicModule;
//# sourceMappingURL=music.module.js.map