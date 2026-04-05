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
exports.UserGuildResponseDto = exports.JoinGuildDto = exports.GuildResponseDto = exports.UpdateGuildDto = exports.CreateGuildDto = exports.EditionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class EditionDto {
    id;
    name;
    year;
    isDefault;
}
exports.EditionDto = EditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FC 25' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2025 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EditionDto.prototype, "isDefault", void 0);
class CreateGuildDto {
    name;
    slug;
    logo;
    banner;
    description;
    editions;
    accentColor;
}
exports.CreateGuildDto = CreateGuildDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EA FC' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateGuildDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ea-fc' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateGuildDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/logo.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuildDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/banner.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuildDto.prototype, "banner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'The official EA FC gaming community' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateGuildDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EditionDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EditionDto),
    __metadata("design:type", Array)
], CreateGuildDto.prototype, "editions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#00FF87' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuildDto.prototype, "accentColor", void 0);
class UpdateGuildDto {
    name;
    logo;
    banner;
    description;
    editions;
    accentColor;
}
exports.UpdateGuildDto = UpdateGuildDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'EA FC Updated' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateGuildDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/new-logo.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGuildDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/new-banner.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGuildDto.prototype, "banner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateGuildDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [EditionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EditionDto),
    __metadata("design:type", Array)
], UpdateGuildDto.prototype, "editions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#FF6B00' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGuildDto.prototype, "accentColor", void 0);
class GuildResponseDto {
    id;
    name;
    slug;
    logo;
    banner;
    description;
    editions;
    memberCount;
    activeNow;
    accentColor;
}
exports.GuildResponseDto = GuildResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    __metadata("design:type", String)
], GuildResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'EA FC' }),
    __metadata("design:type", String)
], GuildResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ea-fc' }),
    __metadata("design:type", String)
], GuildResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/logo.png' }),
    __metadata("design:type", String)
], GuildResponseDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/banner.png' }),
    __metadata("design:type", String)
], GuildResponseDto.prototype, "banner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'The official EA FC gaming community' }),
    __metadata("design:type", String)
], GuildResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EditionDto] }),
    __metadata("design:type", Array)
], GuildResponseDto.prototype, "editions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24500 }),
    __metadata("design:type", Number)
], GuildResponseDto.prototype, "memberCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 892 }),
    __metadata("design:type", Number)
], GuildResponseDto.prototype, "activeNow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#00FF87' }),
    __metadata("design:type", String)
], GuildResponseDto.prototype, "accentColor", void 0);
class JoinGuildDto {
    userId;
    activeEditionId;
}
exports.JoinGuildDto = JoinGuildDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinGuildDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'fc-25' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinGuildDto.prototype, "activeEditionId", void 0);
class UserGuildResponseDto {
    guildId;
    guild;
    joinedAt;
    activeEditionId;
}
exports.UserGuildResponseDto = UserGuildResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    __metadata("design:type", String)
], UserGuildResponseDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", GuildResponseDto)
], UserGuildResponseDto.prototype, "guild", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserGuildResponseDto.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'fc-25' }),
    __metadata("design:type", String)
], UserGuildResponseDto.prototype, "activeEditionId", void 0);
//# sourceMappingURL=guild.dto.js.map