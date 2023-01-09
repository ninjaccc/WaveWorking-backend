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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const role_constant_1 = require("../auth/role.constant");
const channels_service_1 = require("./channels.service");
const add_channel_dto_1 = require("./dto/add-channel.dto");
const join_channel_as_dj_dto_1 = require("./dto/join-channel-as-dj.dto");
const join_channel_as_guest_dto_1 = require("./dto/join-channel-as-guest.dto");
let ChannelsController = class ChannelsController {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    getInfoList() {
        return this.channelsService.getChannelInfoList();
    }
    async joinToChannel(joinChannelAsGuestDto) {
        return this.channelsService.guestJoin(joinChannelAsGuestDto);
    }
    async joinToChannelAsDj(joinChannelAsDjDto) {
        return this.channelsService.djJoin(joinChannelAsDjDto);
    }
    async add(addChannelDto) {
        return this.channelsService.add(addChannelDto);
    }
    getInfo(id) {
        return this.channelsService.getById(id);
    }
    getAllDetail() {
        return this.channelsService.getAll();
    }
    removeAll() {
        return this.channelsService.removeAll();
    }
};
__decorate([
    (0, role_constant_1.SkipJwtAuth)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getInfoList", null);
__decorate([
    (0, role_constant_1.SkipJwtAuth)(),
    (0, common_1.Post)('/join'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_channel_as_guest_dto_1.JoinChannelAsGuestDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "joinToChannel", null);
__decorate([
    (0, role_constant_1.SkipJwtAuth)(),
    (0, common_1.Post)('/join-dj'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_channel_as_dj_dto_1.JoinChannelAsDjDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "joinToChannelAsDj", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_channel_dto_1.AddChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "add", null);
__decorate([
    (0, role_constant_1.SkipJwtAuth)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getInfo", null);
__decorate([
    (0, role_constant_1.SkipJwtAuth)(),
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "getAllDetail", null);
__decorate([
    (0, common_1.Delete)('/system-only'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChannelsController.prototype, "removeAll", null);
ChannelsController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
exports.ChannelsController = ChannelsController;
//# sourceMappingURL=channels.controller.js.map