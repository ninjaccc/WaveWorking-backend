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
exports.MusicSchema = exports.Music = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
let Music = class Music {
};
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: '0IA3ZvCkRkQ',
        format: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Music.prototype, "musicId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: 'I Really Want to Stay At Your House',
        format: 'string',
        minLength: 1,
        required: true,
    }),
    __metadata("design:type", String)
], Music.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: 'Rosa Walton',
        format: 'string',
        minLength: 1,
        required: true,
    }),
    __metadata("design:type", String)
], Music.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: 'https://youtu.be/Dnz-BTz9eDU',
        format: 'string',
    }),
    __metadata("design:type", String)
], Music.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: 'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png',
        format: 'string',
    }),
    __metadata("design:type", String)
], Music.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Map, of: String }),
    __metadata("design:type", Object)
], Music.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: '2022-09-22T12:40:56.757',
        format: 'string',
        required: true,
    }),
    __metadata("design:type", Date)
], Music.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: 'PT3M14S',
        format: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Music.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: '637b38f08e32266d5b5202fa',
        format: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Music.prototype, "channelId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: '637c85907f2cb79eb4608ea3',
        format: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Music.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: '2022-09-22T12:40:56.757',
        format: 'string',
    }),
    __metadata("design:type", Date)
], Music.prototype, "onTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, swagger_1.ApiProperty)({
        example: '2022-09-22T12:40:56.757',
        format: 'string',
    }),
    __metadata("design:type", Date)
], Music.prototype, "canBeReAddedTime", void 0);
Music = __decorate([
    (0, mongoose_1.Schema)()
], Music);
exports.Music = Music;
exports.MusicSchema = mongoose_1.SchemaFactory.createForClass(Music);
//# sourceMappingURL=music.schema.js.map