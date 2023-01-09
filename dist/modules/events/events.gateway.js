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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const uuid_1 = require("uuid");
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const ws_auth_guard_1 = require("../auth/guards/ws-auth.guard");
const role_constant_1 = require("../auth/role.constant");
const music_service_1 = require("../music/music.service");
const users_service_1 = require("../users/users.service");
const cron_service_1 = require("../cron/cron.service");
const DEFAULT_PAGE_SIZE_OF_HISTORY = 10;
let EventsGateway = class EventsGateway {
    constructor(userService, jwtService, cronService, musicService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.cronService = cronService;
        this.musicService = musicService;
        this.channelCache = {};
    }
    handleConnection(client, request) {
        client.send(JSON.stringify({
            event: 'connect',
            data: 'success',
        }));
    }
    handleDisconnect(client) {
        console.log(client.url);
    }
    async joinChannel(client, data) {
        const token = data.token;
        const decodeData = await this.jwtService.verifyAsync(token);
        const { channelId } = decodeData;
        await this.saveInfoToWebsocketClient(client, decodeData);
        this.initChannelCache(channelId);
        this.server.clients.forEach((single) => {
            single.send(JSON.stringify(`使用者${client.userId}已經進入${client.channelId}頻道`));
        });
        this.sendPlaylistToUser(client.userId, client.channelId);
        this.sendHistoryToUser(client.userId, client.channelId, 1);
        if (Number(client.roleId) === role_constant_1.Role.Manager) {
            const toBeAuditedList = this.channelCache[channelId].toBeAuditedList;
            this.sendToUser(client.userId, toBeAuditedList.map((item) => {
                const { name, author, createdAt, _id, thumbnail, duration } = item;
                return {
                    name,
                    author,
                    createdAt,
                    _id,
                    thumbnail,
                    duration,
                };
            }), 'update-audited-list');
        }
    }
    async addMusic(client, data) {
        const { userId, channelId } = client;
        const playData = await this.generatePlayData(data.musicId, userId, channelId);
        this.channelCache[channelId].playList.push(playData);
        this.sendPlaylistOnAChannel(channelId);
    }
    async deleteMusic(client, data) {
        (0, lodash_1.remove)(this.channelCache[client.channelId].playList, (item) => item._id === data._id);
        this.sendPlaylistOnAChannel(client.channelId);
    }
    async applyToInsertMusic(client, data) {
        const { userId, channelId } = client;
        const playData = await this.generatePlayData(data.musicId, userId, channelId);
        this.channelCache[channelId].toBeAuditedList.push(playData);
        const djClient = this.findDjClientInChannel(channelId);
        if (!djClient)
            return;
        djClient.send(JSON.stringify({
            event: 'update-audited-list',
            data: this.channelCache[channelId].toBeAuditedList.map((item) => {
                const { name, author, createdAt, _id, thumbnail, duration } = item;
                return {
                    name,
                    author,
                    createdAt,
                    _id,
                    thumbnail,
                    duration,
                };
            }),
        }));
    }
    async insertMusic(client, data) {
        const { toBeAuditedList } = this.channelCache[client.channelId];
        const toBeInsertMusicList = (0, lodash_1.remove)(toBeAuditedList, (item) => {
            return data.find((d) => d._id === item._id);
        })
            .filter((item, index) => !data[index].cancel)
            .reverse()
            .map((item) => {
            const { userId, channelId, musicId, _id } = item;
            return {
                userId,
                channelId,
                musicId,
                _id,
            };
        });
        if (toBeInsertMusicList.length) {
            const needTopIndex = data
                .filter((item) => item.top)
                .map((item) => toBeInsertMusicList.findIndex((i) => i._id === item._id));
            this.insertMusicListAndSend(toBeInsertMusicList, needTopIndex);
        }
        client.send(JSON.stringify({
            event: 'update-audited-list',
            data: this.channelCache[client.channelId].toBeAuditedList.map((item) => {
                const { name, author, createdAt, _id, thumbnail, duration } = item;
                return {
                    name,
                    author,
                    createdAt,
                    _id,
                    thumbnail,
                    duration,
                };
            }),
        }));
    }
    async updateCurrentMusic(client, data) {
        var _a;
        const channelId = client.channelId;
        const currentPlay = (_a = this.channelCache[channelId].playList) === null || _a === void 0 ? void 0 : _a[0];
        if (currentPlay) {
            const { musicId, onTime, userId, channelId } = currentPlay;
            await this.musicService.add({ musicId, onTime, userId, channelId });
            const endIndex = await this.getLastPageIndexOfHistory(channelId);
            this.sendHistoryOnAChannel(channelId, endIndex);
        }
        if (!data) {
            this.channelCache[channelId].playList = [];
            this.sendPlaylistOnAChannel(channelId);
            return;
        }
        this.channelCache[channelId].playList.shift();
        const [currentMusic] = (0, lodash_1.remove)(this.channelCache[channelId].playList, (item) => item._id === data._id);
        if (!currentMusic) {
            throw new common_1.HttpException('cant find this music!!', 404);
        }
        this.channelCache[channelId].playList.unshift(Object.assign({}, currentMusic));
        this.sendPlaylistOnAChannel(channelId);
    }
    async updateCurrentTime(client, data) {
        this.sendOnAChannel(client.channelId, data, 'update-current-time');
    }
    async likeMusic(client, data) {
        this.likeMusicAndSend(client.userId, data.musicId, true, client.channelId);
    }
    async unlikeMusic(client, data) {
        this.likeMusicAndSend(client.userId, data.musicId, false, client.channelId);
    }
    async setPageSizeOfHistory(client, data) {
        const { channelId } = client;
        this.channelCache[channelId].pageSizeOfHistory = data.pageSize;
        this.sendHistoryOnAChannel(channelId, 1);
    }
    async setPageIndexOfHistory(client, data) {
        const { channelId, userId } = client;
        client.pageIndexOfHistory = data.pageIndex;
        this.sendHistoryToUser(userId, channelId, data.pageIndex);
    }
    async AddMusicFromHistory(client, data) {
        await this.addMusic(client, { musicId: data.musicId });
        const date = new Date();
        date.setMinutes(date.getMinutes() + 1);
        await this.musicService.findByIdAndUpdate(data._id, {
            canBeReAddedTime: date,
        });
        this.sendHistoryOnAChannel(client.channelId, client.pageIndexOfHistory);
        this.cronService.addSpecificTimeJob(`can be added again until ${date.toString()} `, date, async () => {
            await this.musicService.findByIdAndUpdate(data._id, {
                canBeReAddedTime: null,
            });
            this.sendHistoryOnAChannel(client.channelId, client.pageIndexOfHistory);
        });
    }
    async generatePlayData(musicId, userId, channelId) {
        const musicData = await this.musicService.getInfoById(musicId);
        return Object.assign(Object.assign({}, musicData), { userId, likes: {}, channelId, createdAt: Date.now().toString(), onTime: null, _id: (0, uuid_1.v4)() });
    }
    async saveInfoToWebsocketClient(client, decodeData) {
        const { id, channelId, roleId } = decodeData;
        client.channelId = channelId;
        client.roleId = roleId;
        client.userId = id;
        const userData = await this.userService.findById(id);
        client.userName = userData.name;
        client.userAvatar = userData.avatar;
    }
    initChannelCache(channelId) {
        if (!this.channelCache[channelId]) {
            this.channelCache[channelId] = {
                playList: [],
                toBeAuditedList: [],
                pageSizeOfHistory: DEFAULT_PAGE_SIZE_OF_HISTORY,
            };
        }
    }
    async likeMusicAndSend(userId, musicId, like, channelId) {
        this.channelCache[channelId].playList
            .filter((item) => item.musicId === musicId)
            .forEach((item) => (item.likes[userId] = like));
        this.sendPlaylistOnAChannel(channelId);
    }
    async insertMusicListAndSend(items, needTopIndex) {
        const insertIndex = () => {
            if (!this.channelCache[channelId].playList.length)
                return 0;
            const index = (0, lodash_1.findLastIndex)(this.channelCache[channelId].playList, (item) => item.insert);
            return index === -1 ? 1 : index + 1;
        };
        const channelId = items[0].channelId;
        const playDataList = await Promise.all(items.map((item) => {
            const { musicId, userId, channelId } = item;
            return this.generatePlayData(musicId, userId, channelId);
        }));
        const listNeedToBeInsertedToTop = playDataList.filter((item, index) => needTopIndex.includes(index));
        const listNeedToBeInsertedAfterTheLastInsertedItem = playDataList.filter((item, index) => !needTopIndex.includes(index));
        if (listNeedToBeInsertedToTop.length) {
            this.channelCache[channelId].playList.splice(this.channelCache[channelId].playList.length ? 1 : 0, 0, ...listNeedToBeInsertedToTop.map((item) => (Object.assign(Object.assign({}, item), { insert: true }))));
        }
        this.channelCache[channelId].playList.splice(insertIndex(), 0, ...listNeedToBeInsertedAfterTheLastInsertedItem.map((item) => (Object.assign(Object.assign({}, item), { insert: true }))));
        this.sendPlaylistOnAChannel(channelId);
    }
    sendAll(data) {
        this.server.clients.forEach((single) => {
            single.send(JSON.stringify(data));
        });
    }
    sendToUser(userId, data, event) {
        const currentClient = this.findClientByUser(userId);
        if (currentClient) {
            currentClient.send(JSON.stringify({ event, data }));
        }
    }
    sendPlaylistToUser(userId, channelId) {
        this.sendToUser(userId, this.channelCache[channelId].playList.map((item) => this.toClientFormat(item)), 'update-playlist');
    }
    async sendHistoryToUser(userId, channelId, pageIndex) {
        const pageSize = this.channelCache[channelId].pageSizeOfHistory;
        const [musicTotalCount, musicList] = await Promise.all([
            this.musicService.getTotalCount(),
            this.musicService.getByQuery({
                channelId,
            }, {
                skip: (Number(pageIndex) - 1) * Number(pageSize),
                limit: Number(pageSize),
                sort: { createdAt: 'asc' },
            }),
        ]);
        this.sendToUser(userId, {
            pageIndex,
            totalCount: musicTotalCount,
            pageCount: Math.ceil(musicTotalCount / pageSize),
            list: musicList,
        }, 'update-history');
    }
    sendPlaylistOnAChannel(channelId) {
        this.sendOnAChannel(channelId, this.channelCache[channelId].playList.map((item) => this.toClientFormat(item)), 'update-playlist');
    }
    async sendHistoryOnAChannel(channelId, pageIndex) {
        const pageSize = this.channelCache[channelId].pageSizeOfHistory;
        const [musicTotalCount, musicList] = await Promise.all([
            this.musicService.getTotalCount(),
            this.musicService.getByQuery({
                channelId,
            }, {
                skip: (Number(pageIndex) - 1) * Number(pageSize),
                limit: Number(pageSize),
                sort: { createdAt: 'asc' },
            }),
        ]);
        this.sendOnAChannel(channelId, {
            pageIndex,
            totalCount: musicTotalCount,
            pageCount: Math.ceil(musicTotalCount / pageSize),
            list: musicList,
        }, 'update-history');
    }
    async getLastPageIndexOfHistory(channelId) {
        const pageSize = this.channelCache[channelId].pageSizeOfHistory;
        const total = await this.musicService.getTotalCount();
        return Math.floor(total / pageSize) + 1;
    }
    sendOnAChannel(channelId, data, event) {
        this.filterClientsByChannel(channelId).forEach((client) => client.send(JSON.stringify({
            event,
            data,
        })));
    }
    filterClientsByChannel(channelId) {
        return Array.from(this.server.clients).filter((client) => client.channelId === channelId);
    }
    findDjClientInChannel(channelId) {
        return Array.from(this.server.clients).find((item) => item.roleId === role_constant_1.Role.Manager &&
            item.channelId === channelId);
    }
    findClientByUser(userId) {
        return Array.from(this.server.clients).find((client) => client.userId === userId);
    }
    toClientFormat(data) {
        const { name, author, createdAt, _id, thumbnail, duration, insert, musicId, likes, } = data;
        return {
            name,
            author,
            createdAt,
            _id,
            musicId,
            thumbnail,
            duration,
            insert: !!insert,
            likes,
        };
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", ws_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-channel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "joinChannel", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('add-music'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "addMusic", null);
__decorate([
    (0, role_constant_1.Roles)(role_constant_1.Role.Manager),
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('delete-music'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "deleteMusic", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('apply-to-insert-music'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "applyToInsertMusic", null);
__decorate([
    (0, role_constant_1.Roles)(role_constant_1.Role.Manager),
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('insert-music'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "insertMusic", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('update-current-music'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "updateCurrentMusic", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('update-current-time'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "updateCurrentTime", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('like'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "likeMusic", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('unlike'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "unlikeMusic", null);
__decorate([
    (0, role_constant_1.Roles)(role_constant_1.Role.Manager),
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('set-page-size-of-history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "setPageSizeOfHistory", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('set-page-index-of-history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "setPageIndexOfHistory", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, websockets_1.SubscribeMessage)('add-music-from-history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "AddMusicFromHistory", null);
EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        cron_service_1.CronService,
        music_service_1.MusicService])
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=events.gateway.js.map