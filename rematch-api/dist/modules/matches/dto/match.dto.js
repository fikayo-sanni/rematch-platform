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
exports.SpotcheckResponseDto = exports.ResolveSpotcheckDto = exports.AddEvidenceDto = exports.CreateSpotcheckDto = exports.UpdateScoreDto = exports.LiveMatchDto = exports.MatchResponseDto = exports.MatchContextDto = exports.MatchResultDto = exports.SubmitResultDto = exports.CreateMatchDto = exports.CallResponseDto = exports.CreateCallDto = exports.PullResponseDto = exports.AcceptPullDto = exports.CreatePullDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePullDto {
    guildId;
    editionId;
    initiatorId;
    creditPot;
    expiryMinutes;
}
exports.CreatePullDto = CreatePullDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePullDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePullDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePullDto.prototype, "initiatorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], CreatePullDto.prototype, "creditPot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, description: 'Minutes until expiry' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], CreatePullDto.prototype, "expiryMinutes", void 0);
class AcceptPullDto {
    opponentId;
}
exports.AcceptPullDto = AcceptPullDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-002' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcceptPullDto.prototype, "opponentId", void 0);
class PullResponseDto {
    id;
    guildId;
    editionId;
    initiator;
    opponent;
    creditPot;
    status;
    createdAt;
    expiresAt;
}
exports.PullResponseDto = PullResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pull-001' }),
    __metadata("design:type", String)
], PullResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    __metadata("design:type", String)
], PullResponseDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    __metadata("design:type", String)
], PullResponseDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], PullResponseDto.prototype, "initiator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], PullResponseDto.prototype, "opponent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], PullResponseDto.prototype, "creditPot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending', enum: ['pending', 'accepted', 'expired', 'declined'] }),
    __metadata("design:type", String)
], PullResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PullResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PullResponseDto.prototype, "expiresAt", void 0);
class CreateCallDto {
    guildId;
    editionId;
    challengerId;
    challengedId;
    creditPot;
    message;
    expiryMinutes;
}
exports.CreateCallDto = CreateCallDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCallDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCallDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCallDto.prototype, "challengerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-002' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCallDto.prototype, "challengedId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], CreateCallDto.prototype, "creditPot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Let's run it! I've been practicing all week" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCallDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 60, description: 'Minutes until expiry' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], CreateCallDto.prototype, "expiryMinutes", void 0);
class CallResponseDto {
    id;
    guildId;
    editionId;
    challenger;
    challenged;
    creditPot;
    message;
    status;
    createdAt;
    expiresAt;
}
exports.CallResponseDto = CallResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'call-001' }),
    __metadata("design:type", String)
], CallResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    __metadata("design:type", String)
], CallResponseDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    __metadata("design:type", String)
], CallResponseDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], CallResponseDto.prototype, "challenger", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], CallResponseDto.prototype, "challenged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75 }),
    __metadata("design:type", Number)
], CallResponseDto.prototype, "creditPot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Let's run it!" }),
    __metadata("design:type", String)
], CallResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending', enum: ['pending', 'accepted', 'declined', 'expired'] }),
    __metadata("design:type", String)
], CallResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CallResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CallResponseDto.prototype, "expiresAt", void 0);
class CreateMatchDto {
    type;
    guildId;
    editionId;
    player1Id;
    player2Id;
    creditPot;
    scheduledAt;
    context;
}
exports.CreateMatchDto = CreateMatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pull', enum: ['pull', 'call'] }),
    (0, class_validator_1.IsEnum)(['pull', 'call']),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "player1Id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-002' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "player2Id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMatchDto.prototype, "creditPot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateMatchDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Context for tournament/league matches' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateMatchDto.prototype, "context", void 0);
class SubmitResultDto {
    winnerId;
    winnerScore;
    loserScore;
    duration;
}
exports.SubmitResultDto = SubmitResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitResultDto.prototype, "winnerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SubmitResultDto.prototype, "winnerScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SubmitResultDto.prototype, "loserScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 45, description: 'Match duration in minutes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitResultDto.prototype, "duration", void 0);
class MatchResultDto {
    winnerId;
    loserId;
    winnerScore;
    loserScore;
    duration;
}
exports.MatchResultDto = MatchResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    __metadata("design:type", String)
], MatchResultDto.prototype, "winnerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-002' }),
    __metadata("design:type", String)
], MatchResultDto.prototype, "loserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], MatchResultDto.prototype, "winnerScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MatchResultDto.prototype, "loserScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45 }),
    __metadata("design:type", Number)
], MatchResultDto.prototype, "duration", void 0);
class MatchContextDto {
    type;
    id;
    name;
}
exports.MatchContextDto = MatchContextDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tournament', enum: ['challenge', 'tournament', 'league'] }),
    __metadata("design:type", String)
], MatchContextDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'run-001' }),
    __metadata("design:type", String)
], MatchContextDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Daily Grind' }),
    __metadata("design:type", String)
], MatchContextDto.prototype, "name", void 0);
class MatchResponseDto {
    id;
    type;
    guildId;
    editionId;
    player1;
    player2;
    status;
    creditPot;
    createdAt;
    startedAt;
    scheduledAt;
    completedAt;
    result;
    context;
}
exports.MatchResponseDto = MatchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'match-001' }),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pull', enum: ['pull', 'call'] }),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "editionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], MatchResponseDto.prototype, "player1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], MatchResponseDto.prototype, "player2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'pending',
        enum: ['pending', 'accepted', 'in_progress', 'completed', 'disputed', 'cancelled'],
    }),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], MatchResponseDto.prototype, "creditPot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MatchResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], MatchResponseDto.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], MatchResponseDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], MatchResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: MatchResultDto }),
    __metadata("design:type", MatchResultDto)
], MatchResponseDto.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: MatchContextDto }),
    __metadata("design:type", MatchContextDto)
], MatchResponseDto.prototype, "context", void 0);
class LiveMatchDto {
    id;
    matchId;
    player1;
    player2;
    score;
    viewers;
    duration;
    guildId;
    editionId;
}
exports.LiveMatchDto = LiveMatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'live-001' }),
    __metadata("design:type", String)
], LiveMatchDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'match-001' }),
    __metadata("design:type", String)
], LiveMatchDto.prototype, "matchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], LiveMatchDto.prototype, "player1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], LiveMatchDto.prototype, "player2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { player1: 2, player2: 1 } }),
    __metadata("design:type", Object)
], LiveMatchDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 156 }),
    __metadata("design:type", Number)
], LiveMatchDto.prototype, "viewers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '32:15' }),
    __metadata("design:type", String)
], LiveMatchDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'guild-001' }),
    __metadata("design:type", String)
], LiveMatchDto.prototype, "guildId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fc-25' }),
    __metadata("design:type", String)
], LiveMatchDto.prototype, "editionId", void 0);
class UpdateScoreDto {
    score;
}
exports.UpdateScoreDto = UpdateScoreDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: { player1: 2, player2: 1 } }),
    __metadata("design:type", Object)
], UpdateScoreDto.prototype, "score", void 0);
class CreateSpotcheckDto {
    matchId;
    player1Claim;
    player2Claim;
}
exports.CreateSpotcheckDto = CreateSpotcheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'match-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpotcheckDto.prototype, "matchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { playerId: 'user-001', claimedScore: { player: 3, opponent: 1 } } }),
    __metadata("design:type", Object)
], CreateSpotcheckDto.prototype, "player1Claim", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { playerId: 'user-002', claimedScore: { player: 2, opponent: 2 } } }),
    __metadata("design:type", Object)
], CreateSpotcheckDto.prototype, "player2Claim", void 0);
class AddEvidenceDto {
    type;
    url;
    uploadedBy;
}
exports.AddEvidenceDto = AddEvidenceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'screenshot', enum: ['screenshot', 'video'] }),
    (0, class_validator_1.IsEnum)(['screenshot', 'video']),
    __metadata("design:type", String)
], AddEvidenceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.example.com/evidence/img123.png' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddEvidenceDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddEvidenceDto.prototype, "uploadedBy", void 0);
class ResolveSpotcheckDto {
    winnerId;
    finalScore;
    notes;
    resolvedBy;
}
exports.ResolveSpotcheckDto = ResolveSpotcheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-001' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResolveSpotcheckDto.prototype, "winnerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { winner: 3, loser: 1 } }),
    __metadata("design:type", Object)
], ResolveSpotcheckDto.prototype, "finalScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Evidence clearly shows player1 won' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResolveSpotcheckDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-admin' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResolveSpotcheckDto.prototype, "resolvedBy", void 0);
class SpotcheckResponseDto {
    id;
    matchId;
    match;
    status;
    evidence;
    player1Claim;
    player2Claim;
    resolution;
    createdAt;
    resolvedAt;
}
exports.SpotcheckResponseDto = SpotcheckResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'spot-001' }),
    __metadata("design:type", String)
], SpotcheckResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'match-001' }),
    __metadata("design:type", String)
], SpotcheckResponseDto.prototype, "matchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", MatchResponseDto)
], SpotcheckResponseDto.prototype, "match", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending', enum: ['pending', 'reviewing', 'resolved', 'escalated'] }),
    __metadata("design:type", String)
], SpotcheckResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], SpotcheckResponseDto.prototype, "evidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], SpotcheckResponseDto.prototype, "player1Claim", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], SpotcheckResponseDto.prototype, "player2Claim", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SpotcheckResponseDto.prototype, "resolution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SpotcheckResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], SpotcheckResponseDto.prototype, "resolvedAt", void 0);
//# sourceMappingURL=match.dto.js.map