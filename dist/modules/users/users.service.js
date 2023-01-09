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
exports.UsersService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const role_constant_1 = require("../auth/role.constant");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        var _a;
        const { email, password, name, gender } = createUserDto;
        const existUser = await this.userModel.findOne({ email });
        if (existUser) {
            throw new common_1.HttpException('exist user!', 404);
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const user = (await this.userModel.create({
            email,
            name,
            gender,
            password: hashPassword,
            roleId: (_a = createUserDto.roleId) !== null && _a !== void 0 ? _a : role_constant_1.Role.User,
        })).toObject();
        delete user.password;
        delete user.roleId;
        return user;
    }
    async createGoogle(email, name) {
        const user = (await this.userModel.create({
            email,
            name,
            password: '',
            gender: 3,
            roleId: role_constant_1.Role.User,
        })).toObject();
        delete user.password;
        delete user.roleId;
        return user;
    }
    findAll() {
        return this.userModel.find();
    }
    findById(id) {
        return this.userModel.findById(id);
    }
    findOne(filter) {
        return this.userModel.findOne(filter);
    }
    updateProfile(id, updateProfileDto) {
        return this.userModel.findByIdAndUpdate(id, updateProfileDto);
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return this.userModel.remove(id);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map