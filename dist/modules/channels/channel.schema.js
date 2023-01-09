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
exports.ChannelSchema = exports.Channel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
let Channel = class Channel {
};
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: 'MusicBarLaLa',
        format: 'string',
        minLength: 2,
        maxLength: 18,
        required: true,
    }),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: 'password',
        format: 'string',
        minLength: 0,
        maxLength: 20,
        required: true,
    }),
    __metadata("design:type", String)
], Channel.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: '2022-09-22T12:40:56.757',
        format: 'string',
        required: true,
    }),
    __metadata("design:type", Date)
], Channel.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: 'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png',
        format: 'string',
    }),
    __metadata("design:type", String)
], Channel.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: '637b8929b8cb2d3eff5273e0',
        format: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Channel.prototype, "managerId", void 0);
Channel = __decorate([
    (0, mongoose_1.Schema)()
], Channel);
exports.Channel = Channel;
exports.ChannelSchema = mongoose_1.SchemaFactory.createForClass(Channel);
//# sourceMappingURL=channel.schema.js.map