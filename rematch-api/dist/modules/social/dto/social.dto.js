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
exports.ActivityResponseDto = exports.NotificationResponseDto = exports.ReplyResponseDto = exports.CreateReplyDto = exports.NoisePostResponseDto = exports.CreateNoisePostDto = exports.CrewResponseDto = exports.CreateCrewDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCrewDto {
    name;
    tag;
    logo;
    description;
    leaderId;
}
exports.CreateCrewDto = CreateCrewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Night Owls' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCrewDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NITE' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateCrewDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/logo.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCrewDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Best night-time players' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCrewDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCrewDto.prototype, "leaderId", void 0);
class CrewResponseDto {
    id;
    name;
    tag;
    logo;
    description;
    leaderId;
    members;
    memberCount;
    wins;
    losses;
    rank;
}
exports.CrewResponseDto = CrewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CrewResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CrewResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CrewResponseDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CrewResponseDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CrewResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CrewResponseDto.prototype, "leaderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], CrewResponseDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CrewResponseDto.prototype, "memberCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CrewResponseDto.prototype, "wins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CrewResponseDto.prototype, "losses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CrewResponseDto.prototype, "rank", void 0);
class CreateNoisePostDto {
    authorId;
    content;
    image;
    clipUrl;
    guildId;
    mentions;
}
exports.CreateNoisePostDto = CreateNoisePostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNoisePostDto.prototype, "authorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Just went on a 15-game win streak! Who wants smoke?' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateNoisePostDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/image.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNoisePostDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/clip.mp4' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNoisePostDto.prototype, "clipUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'guild-001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNoisePostDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['ShadowStrike', 'NightHawk'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateNoisePostDto.prototype, "mentions", void 0);
class NoisePostResponseDto {
    id;
    author;
    content;
    image;
    clipUrl;
    guildId;
    likes;
    replies;
    isLiked;
    mentions;
    createdAt;
}
exports.NoisePostResponseDto = NoisePostResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NoisePostResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], NoisePostResponseDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NoisePostResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NoisePostResponseDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NoisePostResponseDto.prototype, "clipUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], NoisePostResponseDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NoisePostResponseDto.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], NoisePostResponseDto.prototype, "replies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NoisePostResponseDto.prototype, "isLiked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], NoisePostResponseDto.prototype, "mentions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], NoisePostResponseDto.prototype, "createdAt", void 0);
class CreateReplyDto {
    authorId;
    content;
}
exports.CreateReplyDto = CreateReplyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReplyDto.prototype, "authorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Great game!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateReplyDto.prototype, "content", void 0);
class ReplyResponseDto {
    id;
    postId;
    author;
    content;
    likes;
    isLiked;
    createdAt;
}
exports.ReplyResponseDto = ReplyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReplyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReplyResponseDto.prototype, "postId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ReplyResponseDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReplyResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReplyResponseDto.prototype, "likes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ReplyResponseDto.prototype, "isLiked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReplyResponseDto.prototype, "createdAt", void 0);
class NotificationResponseDto {
    id;
    userId;
    type;
    title;
    message;
    isRead;
    data;
    createdAt;
}
exports.NotificationResponseDto = NotificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: [
            'match_found',
            'challenge_received',
            'challenge_accepted',
            'match_ready',
            'match_result',
            'verification_request',
            'tournament_update',
            'league_update',
            'feed_mention',
            'team_invite',
            'team_update',
        ],
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], NotificationResponseDto.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "createdAt", void 0);
class ActivityResponseDto {
    id;
    userId;
    user;
    type;
    description;
    data;
    createdAt;
}
exports.ActivityResponseDto = ActivityResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivityResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivityResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ActivityResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: [
            'match_won',
            'match_lost',
            'rank_achieved',
            'guild_joined',
            'crew_joined',
            'tournament_won',
            'achievement_unlocked',
        ],
    }),
    __metadata("design:type", String)
], ActivityResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ActivityResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ActivityResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ActivityResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=social.dto.js.map