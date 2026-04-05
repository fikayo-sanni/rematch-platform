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
exports.JoinCompetitionDto = exports.UpdateStandingsDto = exports.LeagueResponseDto = exports.LeagueStandingDto = exports.CreateLeagueDto = exports.RunResponseDto = exports.CreateRunDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateRunDto {
    name;
    type;
    guildId;
    editionId;
    creditPot;
    maxParticipants;
    startsAt;
    endsAt;
}
exports.CreateRunDto = CreateRunDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Daily Grind' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRunDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'daily', enum: ['daily', 'weekend', 'crew', 'rank_push', 'special'] }),
    (0, class_validator_1.IsEnum)(['daily', 'weekend', 'crew', 'rank_push', 'special']),
    __metadata("design:type", String)
], CreateRunDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRunDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRunDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreateRunDto.prototype, "creditPot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 128 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(4),
    (0, class_validator_1.Max)(1024),
    __metadata("design:type", Number)
], CreateRunDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-20T10:00:00Z' }),
    __metadata("design:type", Date)
], CreateRunDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-20T18:00:00Z' }),
    __metadata("design:type", Date)
], CreateRunDto.prototype, "endsAt", void 0);
class RunResponseDto {
    id;
    name;
    type;
    guildId;
    editionId;
    creditPot;
    participantCount;
    maxParticipants;
    participants;
    startsAt;
    endsAt;
    isActive;
    winner;
}
exports.RunResponseDto = RunResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'run-001' }),
    __metadata("design:type", String)
], RunResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Daily Grind' }),
    __metadata("design:type", String)
], RunResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'daily' }),
    __metadata("design:type", String)
], RunResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    __metadata("design:type", String)
], RunResponseDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    __metadata("design:type", String)
], RunResponseDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    __metadata("design:type", Number)
], RunResponseDto.prototype, "creditPot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 64 }),
    __metadata("design:type", Number)
], RunResponseDto.prototype, "participantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 128 }),
    __metadata("design:type", Number)
], RunResponseDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], RunResponseDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RunResponseDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RunResponseDto.prototype, "endsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], RunResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], RunResponseDto.prototype, "winner", void 0);
class CreateLeagueDto {
    name;
    type;
    guildId;
    editionId;
    entryFee;
    prizePool;
    maxParticipants;
    matchesPerPlayer;
    startsAt;
    endsAt;
}
exports.CreateLeagueDto = CreateLeagueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ultimate Champions League' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeagueDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'round_robin', enum: ['round_robin', 'knockout', 'swiss'] }),
    (0, class_validator_1.IsEnum)(['round_robin', 'knockout', 'swiss']),
    __metadata("design:type", String)
], CreateLeagueDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeagueDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeagueDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    __metadata("design:type", Number)
], CreateLeagueDto.prototype, "entryFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreateLeagueDto.prototype, "prizePool", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 16 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(4),
    (0, class_validator_1.Max)(64),
    __metadata("design:type", Number)
], CreateLeagueDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLeagueDto.prototype, "matchesPerPlayer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-25T10:00:00Z' }),
    __metadata("design:type", Date)
], CreateLeagueDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-02-01T18:00:00Z' }),
    __metadata("design:type", Date)
], CreateLeagueDto.prototype, "endsAt", void 0);
class LeagueStandingDto {
    userId;
    user;
    played;
    wins;
    draws;
    losses;
    goalsFor;
    goalsAgainst;
    points;
}
exports.LeagueStandingDto = LeagueStandingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    __metadata("design:type", String)
], LeagueStandingDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], LeagueStandingDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], LeagueStandingDto.prototype, "played", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], LeagueStandingDto.prototype, "wins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], LeagueStandingDto.prototype, "draws", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], LeagueStandingDto.prototype, "losses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], LeagueStandingDto.prototype, "goalsFor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], LeagueStandingDto.prototype, "goalsAgainst", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 13 }),
    __metadata("design:type", Number)
], LeagueStandingDto.prototype, "points", void 0);
class LeagueResponseDto {
    id;
    name;
    type;
    guildId;
    editionId;
    status;
    entryFee;
    prizePool;
    participantCount;
    maxParticipants;
    matchesPerPlayer;
    participants;
    standings;
    startsAt;
    endsAt;
    winner;
}
exports.LeagueResponseDto = LeagueResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'league-001' }),
    __metadata("design:type", String)
], LeagueResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ultimate Champions League' }),
    __metadata("design:type", String)
], LeagueResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'round_robin' }),
    __metadata("design:type", String)
], LeagueResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    __metadata("design:type", String)
], LeagueResponseDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    __metadata("design:type", String)
], LeagueResponseDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active', enum: ['upcoming', 'active', 'completed'] }),
    __metadata("design:type", String)
], LeagueResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], LeagueResponseDto.prototype, "entryFee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2500 }),
    __metadata("design:type", Number)
], LeagueResponseDto.prototype, "prizePool", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], LeagueResponseDto.prototype, "participantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 16 }),
    __metadata("design:type", Number)
], LeagueResponseDto.prototype, "maxParticipants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], LeagueResponseDto.prototype, "matchesPerPlayer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], LeagueResponseDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [LeagueStandingDto] }),
    __metadata("design:type", Array)
], LeagueResponseDto.prototype, "standings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LeagueResponseDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LeagueResponseDto.prototype, "endsAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], LeagueResponseDto.prototype, "winner", void 0);
class UpdateStandingsDto {
    winnerId;
    loserId;
    winnerGoals;
    loserGoals;
    isDraw;
}
exports.UpdateStandingsDto = UpdateStandingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStandingsDto.prototype, "winnerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-002' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateStandingsDto.prototype, "loserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateStandingsDto.prototype, "winnerGoals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateStandingsDto.prototype, "loserGoals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateStandingsDto.prototype, "isDraw", void 0);
class JoinCompetitionDto {
    userId;
}
exports.JoinCompetitionDto = JoinCompetitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinCompetitionDto.prototype, "userId", void 0);
//# sourceMappingURL=competition.dto.js.map