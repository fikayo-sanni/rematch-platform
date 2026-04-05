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
exports.UpdateCreditsDto = exports.UserStatsDto = exports.AuthResponseDto = exports.RankEntryDto = exports.UserResponseDto = exports.UpdateUserDto = exports.LoginDto = exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateUserDto {
    username;
    email;
    password;
    bio;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ShadowStrike' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shadow@rematch.gg' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'securePassword123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Competitive FIFA player. Come catch these hands.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateUserDto.prototype, "bio", void 0);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shadow@rematch.gg' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'securePassword123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class UpdateUserDto {
    username;
    bio;
    avatar;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'NewUsername' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'New bio here' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/avatar.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "avatar", void 0);
class UserResponseDto {
    id;
    username;
    email;
    avatar;
    bio;
    reputation;
    xp;
    level;
    credits;
    isOnline;
    createdAt;
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ShadowStrike' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shadow@rematch.gg' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=user-001' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Competitive FIFA player. Come catch these hands.' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4.8 }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "reputation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12500 }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "xp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24 }),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { rc: 2450, bc: 150 } }),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "credits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
class RankEntryDto {
    rank;
    user;
    wins;
    losses;
    creditsEarned;
    winStreak;
    change;
}
exports.RankEntryDto = RankEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RankEntryDto.prototype, "rank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", UserResponseDto)
], RankEntryDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 187 }),
    __metadata("design:type", Number)
], RankEntryDto.prototype, "wins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 23 }),
    __metadata("design:type", Number)
], RankEntryDto.prototype, "losses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45200 }),
    __metadata("design:type", Number)
], RankEntryDto.prototype, "creditsEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], RankEntryDto.prototype, "winStreak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], RankEntryDto.prototype, "change", void 0);
class AuthResponseDto {
    user;
    token;
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", UserResponseDto)
], AuthResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "token", void 0);
class UserStatsDto {
    userId;
    totalMatches;
    wins;
    losses;
    winRate;
    currentStreak;
    bestStreak;
    totalPlayTime;
    creditsEarned;
    tournamentWins;
}
exports.UserStatsDto = UserStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    __metadata("design:type", String)
], UserStatsDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 180 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "totalMatches", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 142 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "wins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 38 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "losses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 78.9 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "winRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "currentStreak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "bestStreak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4520 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "totalPlayTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 32100 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "creditsEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "tournamentWins", void 0);
class UpdateCreditsDto {
    amount;
    type;
    operation;
}
exports.UpdateCreditsDto = UpdateCreditsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCreditsDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'rc', enum: ['rc', 'bc'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCreditsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'add', enum: ['add', 'subtract'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCreditsDto.prototype, "operation", void 0);
//# sourceMappingURL=user.dto.js.map