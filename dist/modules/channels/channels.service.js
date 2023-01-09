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
exports.ChannelsService = void 0;
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_service_1 = require("../users/users.service");
const channel_schema_1 = require("./channel.schema");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../auth/auth.service");
const role_constant_1 = require("../auth/role.constant");
let ChannelsService = class ChannelsService {
    constructor(channelModel, authService, userService, jwtService) {
        this.channelModel = channelModel;
        this.authService = authService;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async add(addChannelDto) {
        const { name, thumbnail, password, managerId } = addChannelDto;
        const correctPassword = password ? await bcrypt.hash(password, 12) : '';
        const newChannel = await this.channelModel.create({
            name,
            createdAt: Date.now(),
            password: correctPassword,
            managerId,
            thumbnail: thumbnail || 'https://cdn-icons-png.flaticon.com/128/4185/4185501.png',
        });
        return newChannel.save();
    }
    async guestJoin(joinChannelAsGuestDto) {
        const { name, channelId, channelPassword } = joinChannelAsGuestDto;
        try {
            const existUser = await this.userService.findOne({ name });
            if (existUser) {
                throw new Error('user name is exist, please change one!');
            }
            const currentChannel = await this.getChannelById(channelId);
            if (!currentChannel) {
                throw new Error('can not find this channel!');
            }
            const realChannelPassword = currentChannel.password;
            const isPasswordCorrect = await bcrypt.compare(channelPassword, realChannelPassword);
            if (!isPasswordCorrect) {
                throw new Error('password is not correct');
            }
            const guestUser = await this.userService.create({
                name,
                email: (0, uuid_1.v4)(),
                password: 'unknownPassword',
                gender: 1,
                roleId: role_constant_1.Role.Guest,
            });
            const token = this.jwtService.sign({
                id: guestUser._id,
                roleId: guestUser.roleId,
                channelId: currentChannel._id,
            }, {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_EXPIRES_DAY,
            });
            return { token };
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    async djJoin(joinChannelAsDjDto) {
        const { email, password, channelId } = joinChannelAsDjDto;
        try {
            const currentUser = await this.authService.validateUser(email, password);
            const channel = await this.channelModel.findById(channelId);
            if (!channel) {
                throw new Error('cant find this channel!');
            }
            const token = this.jwtService.sign({
                id: currentUser._id,
                roleId: currentUser.roleId,
                channelId: channel._id,
            }, {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_EXPIRES_DAY,
            });
            return { token };
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    getChannelById(channelId) {
        return this.channelModel.findById(channelId);
    }
    async getChannelInfoList() {
        const channelList = await this.channelModel
            .find()
            .where()
            .select('-createdAt');
        return channelList.map((channel) => {
            const { _id, name, thumbnail } = channel;
            return {
                _id,
                name,
                thumbnail,
                isLock: !!channel.password,
            };
        });
    }
    removeAll() {
        return this.channelModel.remove();
    }
    getById(id) {
        return this.channelModel.findById(id);
    }
    getAll() {
        return this.channelModel.find();
    }
};
ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(channel_schema_1.Channel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        auth_service_1.AuthService,
        users_service_1.UsersService,
        jwt_1.JwtService])
], ChannelsService);
exports.ChannelsService = ChannelsService;
//# sourceMappingURL=channels.service.js.map