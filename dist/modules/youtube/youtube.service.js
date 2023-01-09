"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: './google-application-credentials.json',
    scopes: ['https://www.googleapis.com/auth/youtube'],
});
const DEFAULT_PART = 'snippet';
const DEFAULT_FIELD = 'items(id,snippet(publishedAt,title,channelTitle,thumbnails),contentDetails(duration))';
let YoutubeService = class YoutubeService {
    constructor() {
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            auth: auth,
        });
    }
    async searchByQuery(query, maxResults) {
        const videoIdList = (await this.youtube.search.list({
            part: [DEFAULT_PART],
            q: query,
            fields: 'items(id)',
            maxResults,
        })).data.items.map((item) => item.id.videoId);
        return await this.youtube.videos.list({
            part: [DEFAULT_PART, 'contentDetails'],
            id: videoIdList,
            fields: DEFAULT_FIELD,
            maxResults,
        });
    }
    getInfoByVideoIds(ids) {
        return this.youtube.videos.list({
            part: [DEFAULT_PART, 'contentDetails'],
            fields: DEFAULT_FIELD,
            id: [...ids],
        });
    }
};
YoutubeService = __decorate([
    (0, common_1.Injectable)()
], YoutubeService);
exports.YoutubeService = YoutubeService;
//# sourceMappingURL=youtube.service.js.map