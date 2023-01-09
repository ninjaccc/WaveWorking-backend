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
exports.MusicController = void 0;
const common_1 = require("@nestjs/common");
const music_service_1 = require("./music.service");
const add_music_by_url_or_id_dto_1 = require("./dto/add-music-by-url-or-id.dto");
const swagger_1 = require("@nestjs/swagger");
const role_constant_1 = require("../auth/role.constant");
let MusicController = class MusicController {
    constructor(musicService) {
        this.musicService = musicService;
    }
    search(query) {
        return this.musicService.searchByQuery(query);
    }
    async addByUrlOrId(addMusicByUrlOrIdDto, req) {
        const { id: musicId, url } = addMusicByUrlOrIdDto;
        const { user } = req;
        const { id: userId, channelId } = user;
        return this.musicService.add({
            userId,
            channelId,
            musicId,
            url: url,
        });
    }
    getInfo(id) {
        return this.musicService.getInfoById(id);
    }
    getAll() {
        return this.musicService.getAll();
    }
    removeAll() {
        return this.musicService.removeAll();
    }
};
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MusicController.prototype, "search", null);
__decorate([
    (0, role_constant_1.Roles)(role_constant_1.Role.Admin),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_music_by_url_or_id_dto_1.AddMusicByUrlOrIdDto, Object]),
    __metadata("design:returntype", Promise)
], MusicController.prototype, "addByUrlOrId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MusicController.prototype, "getInfo", null);
__decorate([
    (0, role_constant_1.Roles)(role_constant_1.Role.Admin),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MusicController.prototype, "getAll", null);
__decorate([
    (0, role_constant_1.Roles)(role_constant_1.Role.Admin),
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MusicController.prototype, "removeAll", null);
MusicController = __decorate([
    (0, swagger_1.ApiTags)('music'),
    (0, common_1.Controller)('music'),
    __metadata("design:paramtypes", [music_service_1.MusicService])
], MusicController);
exports.MusicController = MusicController;
//# sourceMappingURL=music.controller.js.map