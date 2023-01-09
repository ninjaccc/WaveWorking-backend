"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const music_schema_1 = require("./music.schema");
const mongoose_2 = require("mongoose");
const youtube_service_1 = require("../youtube/youtube.service");
let MusicService = class MusicService {
    constructor(musicModel, youtubeService) {
        this.musicModel = musicModel;
        this.youtubeService = youtubeService;
    }
    async searchByQuery(query) {
        const { q, maxResults } = query;
        if (!q)
            throw new common_1.HttpException('should pass string with q, e.g. q=music', 404);
        if (maxResults && isNaN(Number(maxResults))) {
            throw new common_1.HttpException('maxResults should be a invalid number', 404);
        }
        const originItems = (await this.youtubeService.searchByQuery(q, Number(maxResults) || 12)).data.items;
        return originItems.map((item) => this.transformVideoResponse(item));
    }
    findByIdAndUpdate(id, updateData) {
        return this.musicModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    async getInfoById(id) {
        const items = (await this.youtubeService.getInfoByVideoIds([id])).data
            .items;
        return items.length ? this.transformVideoResponse(items[0]) : null;
    }
    async getAll() {
        return this.musicModel.find();
    }
    async getTotalCount() {
        return this.musicModel.countDocuments({});
    }
    async getByQuery(query, options) {
        if (!options) {
            return this.musicModel.find(query);
        }
        else {
            return this.musicModel
                .find(query)
                .select(options.select || '')
                .sort(options.sort || { createdAt: 'desc' })
                .skip(options.skip || 0)
                .limit(options.limit || 12);
        }
    }
    async add(params) {
        const { url, musicId } = params;
        if (!url && !musicId) {
            throw new common_1.HttpException('please select url or musicId to add music', 404);
        }
        const id = url && !musicId ? this.getIdByUrl(url) : musicId;
        return this.create(Object.assign(Object.assign({}, params), { musicId: id }));
    }
    getIdByUrl(url) {
        if (!url.includes('youtu')) {
            throw new common_1.HttpException('currently, we only have youtube link to search, please use youtube link for add music', 404);
        }
        let id;
        if (url.includes('watch?v=')) {
            id = url.split('watch?v=')[1].split('&')[0];
        }
        else if (url.includes('youtu.be/')) {
            id = url.split('youtu.be/')[1];
        }
        return id;
    }
    async create(params) {
        const { userId, channelId, musicId, onTime } = params;
        const info = await this.getInfoById(musicId);
        if (!info) {
            throw new common_1.HttpException('cant find this music!', 404);
        }
        const { name, author, thumbnail, duration } = info;
        const res = (await this.musicModel.create({
            name,
            musicId,
            author,
            thumbnail,
            duration,
            userId,
            channelId,
            likes: {},
            createdAt: Date.now(),
            onTime: onTime ? new Date(onTime) : null,
        })).toObject();
        return Object.assign(Object.assign({}, res), { _id: res._id.toString() });
    }
    transformVideoResponse(item) {
        const { thumbnails, title, channelTitle } = item.snippet;
        const { duration } = item.contentDetails;
        return {
            name: title,
            author: channelTitle,
            musicId: item.id,
            thumbnail: thumbnails.medium.url,
            duration,
        };
    }
    findByIdAndDelete(id) {
        return this.musicModel.findByIdAndDelete(id);
    }
    removeAll() {
        return this.musicModel.remove();
    }
};
MusicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(music_schema_1.Music.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        youtube_service_1.YoutubeService])
], MusicService);
exports.MusicService = MusicService;
//# sourceMappingURL=music.service.js.map