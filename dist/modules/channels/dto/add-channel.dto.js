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
exports.AddChannelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddChannelDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(18),
    (0, swagger_1.ApiProperty)({
        example: 'MusicBarLaLa',
        format: 'string',
        minLength: 2,
        maxLength: 18,
        required: true,
    }),
    __metadata("design:type", String)
], AddChannelDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'https://cdn-icons-png.flaticon.com/128/4185/4185501.png',
        description: 'The image of the channel',
        format: 'string',
    }),
    __metadata("design:type", String)
], AddChannelDto.prototype, "thumbnail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'GsHEVHyQ8pQalnww8fg.V2yxiC',
        description: 'The password of the channel',
        format: 'string',
    }),
    __metadata("design:type", String)
], AddChannelDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: '637b8929b8cb2d3eff5273e0',
        format: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], AddChannelDto.prototype, "managerId", void 0);
exports.AddChannelDto = AddChannelDto;
//# sourceMappingURL=add-channel.dto.js.map