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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const matches_service_1 = require("./matches.service");
const match_dto_1 = require("./dto/match.dto");
let MatchesController = class MatchesController {
    matchesService;
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    async createPull(dto) {
        return this.matchesService.createPull(dto);
    }
    async acceptPull(id, dto) {
        return this.matchesService.acceptPull(id, dto);
    }
    async declinePull(id, opponentId) {
        return this.matchesService.declinePull(id, opponentId);
    }
    async getPull(id) {
        return this.matchesService.getPull(id);
    }
    async getPendingPulls(guildId, editionId) {
        return this.matchesService.getPendingPulls(guildId, editionId);
    }
    async getUserPulls(userId, status) {
        return this.matchesService.getUserPulls(userId, status);
    }
    async createCall(dto) {
        return this.matchesService.createCall(dto);
    }
    async acceptCall(id) {
        return this.matchesService.acceptCall(id);
    }
    async declineCall(id) {
        return this.matchesService.declineCall(id);
    }
    async getCall(id) {
        return this.matchesService.getCall(id);
    }
    async getPendingCalls(guildId, status) {
        return this.matchesService.getPendingCalls(guildId, status);
    }
    async getUserCalls(userId, type) {
        return this.matchesService.getUserCalls(userId, type);
    }
    async createMatch(dto) {
        return this.matchesService.createMatch(dto);
    }
    async startMatch(id) {
        return this.matchesService.startMatch(id);
    }
    async submitResult(id, dto) {
        return this.matchesService.submitResult(id, dto);
    }
    async disputeMatch(id) {
        return this.matchesService.disputeMatch(id);
    }
    async cancelMatch(id) {
        return this.matchesService.cancelMatch(id);
    }
    async getMatch(id) {
        return this.matchesService.getMatch(id);
    }
    async getMatches(guildId, status, userId, limit, skip) {
        return this.matchesService.getMatches({
            guildId,
            status,
            userId,
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
        });
    }
    async getUserMatchHistory(userId, limit) {
        return this.matchesService.getUserMatchHistory(userId, limit ? Number(limit) : 10);
    }
    async getLiveMatches(guildId) {
        return this.matchesService.getLiveMatches(guildId);
    }
    async getLiveMatch(matchId) {
        return this.matchesService.getLiveMatch(matchId);
    }
    async updateLiveScore(matchId, dto) {
        return this.matchesService.updateLiveScore(matchId, dto.score);
    }
    async joinAsViewer(matchId) {
        await this.matchesService.addViewer(matchId);
        return { success: true };
    }
    async leaveAsViewer(matchId) {
        await this.matchesService.removeViewer(matchId);
        return { success: true };
    }
    async createSpotcheck(dto) {
        return this.matchesService.createSpotcheck(dto);
    }
    async addEvidence(id, dto) {
        return this.matchesService.addEvidence(id, dto);
    }
    async resolveSpotcheck(id, dto) {
        return this.matchesService.resolveSpotcheck(id, dto);
    }
    async getSpotcheck(id) {
        return this.matchesService.getSpotcheck(id);
    }
    async getPendingSpotchecks(userId) {
        return this.matchesService.getPendingSpotchecks(userId);
    }
    async assignSpotcheck(id, assignedTo) {
        return this.matchesService.assignSpotcheck(id, assignedTo);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Post)('pulls'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a quick match pull' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pull created', type: match_dto_1.PullResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_dto_1.CreatePullDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "createPull", null);
__decorate([
    (0, common_1.Post)('pulls/:id/accept'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Accept a pull' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pull accepted, match created', type: match_dto_1.MatchResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_dto_1.AcceptPullDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "acceptPull", null);
__decorate([
    (0, common_1.Post)('pulls/:id/decline'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Decline a pull' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pull declined' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('opponentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "declinePull", null);
__decorate([
    (0, common_1.Get)('pulls/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pull by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pull details', type: match_dto_1.PullResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getPull", null);
__decorate([
    (0, common_1.Get)('pulls/guild/:guildId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending pulls for a guild' }),
    (0, swagger_1.ApiQuery)({ name: 'editionId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pulls', type: [match_dto_1.PullResponseDto] }),
    __param(0, (0, common_1.Param)('guildId')),
    __param(1, (0, common_1.Query)('editionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getPendingPulls", null);
__decorate([
    (0, common_1.Get)('pulls/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pulls for a user' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pulls', type: [match_dto_1.PullResponseDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getUserPulls", null);
__decorate([
    (0, common_1.Post)('calls'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a challenge' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Challenge created', type: match_dto_1.CallResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_dto_1.CreateCallDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "createCall", null);
__decorate([
    (0, common_1.Post)('calls/:id/accept'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Accept a challenge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Challenge accepted, match created', type: match_dto_1.MatchResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "acceptCall", null);
__decorate([
    (0, common_1.Post)('calls/:id/decline'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Decline a challenge' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Challenge declined' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "declineCall", null);
__decorate([
    (0, common_1.Get)('calls/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get challenge by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Challenge details', type: match_dto_1.CallResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getCall", null);
__decorate([
    (0, common_1.Get)('calls/guild/:guildId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get challenges for a guild' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of challenges', type: [match_dto_1.CallResponseDto] }),
    __param(0, (0, common_1.Param)('guildId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getPendingCalls", null);
__decorate([
    (0, common_1.Get)('calls/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get challenges for a user' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['sent', 'received'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of challenges', type: [match_dto_1.CallResponseDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getUserCalls", null);
__decorate([
    (0, common_1.Post)('matches'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a match directly' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Match created', type: match_dto_1.MatchResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_dto_1.CreateMatchDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "createMatch", null);
__decorate([
    (0, common_1.Post)('matches/:id/start'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match started', type: match_dto_1.MatchResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "startMatch", null);
__decorate([
    (0, common_1.Post)('matches/:id/result'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit match result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Result submitted', type: match_dto_1.MatchResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_dto_1.SubmitResultDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "submitResult", null);
__decorate([
    (0, common_1.Post)('matches/:id/dispute'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Dispute a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match disputed', type: match_dto_1.MatchResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "disputeMatch", null);
__decorate([
    (0, common_1.Post)('matches/:id/cancel'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match cancelled' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "cancelMatch", null);
__decorate([
    (0, common_1.Get)('matches/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get match by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match details', type: match_dto_1.MatchResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getMatch", null);
__decorate([
    (0, common_1.Get)('matches'),
    (0, swagger_1.ApiOperation)({ summary: 'Get matches' }),
    (0, swagger_1.ApiQuery)({ name: 'guildId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of matches', type: [match_dto_1.MatchResponseDto] }),
    __param(0, (0, common_1.Query)('guildId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getMatches", null);
__decorate([
    (0, common_1.Get)('matches/user/:userId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user match history' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match history', type: [match_dto_1.MatchResponseDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getUserMatchHistory", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Get live matches' }),
    (0, swagger_1.ApiQuery)({ name: 'guildId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of live matches', type: [match_dto_1.LiveMatchDto] }),
    __param(0, (0, common_1.Query)('guildId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getLiveMatches", null);
__decorate([
    (0, common_1.Get)('live/:matchId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get live match details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Live match details', type: match_dto_1.LiveMatchDto }),
    __param(0, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getLiveMatch", null);
__decorate([
    (0, common_1.Put)('live/:matchId/score'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update live match score' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Score updated', type: match_dto_1.LiveMatchDto }),
    __param(0, (0, common_1.Param)('matchId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_dto_1.UpdateScoreDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "updateLiveScore", null);
__decorate([
    (0, common_1.Post)('live/:matchId/join'),
    (0, swagger_1.ApiOperation)({ summary: 'Join as viewer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Joined as viewer' }),
    __param(0, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "joinAsViewer", null);
__decorate([
    (0, common_1.Post)('live/:matchId/leave'),
    (0, swagger_1.ApiOperation)({ summary: 'Leave as viewer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Left as viewer' }),
    __param(0, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "leaveAsViewer", null);
__decorate([
    (0, common_1.Post)('spotchecks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a spotcheck (dispute)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Spotcheck created', type: match_dto_1.SpotcheckResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_dto_1.CreateSpotcheckDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "createSpotcheck", null);
__decorate([
    (0, common_1.Post)('spotchecks/:id/evidence'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add evidence to spotcheck' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evidence added', type: match_dto_1.SpotcheckResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_dto_1.AddEvidenceDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "addEvidence", null);
__decorate([
    (0, common_1.Post)('spotchecks/:id/resolve'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve a spotcheck' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Spotcheck resolved', type: match_dto_1.SpotcheckResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, match_dto_1.ResolveSpotcheckDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "resolveSpotcheck", null);
__decorate([
    (0, common_1.Get)('spotchecks/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get spotcheck by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Spotcheck details', type: match_dto_1.SpotcheckResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getSpotcheck", null);
__decorate([
    (0, common_1.Get)('spotchecks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending spotchecks' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by assigned user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of spotchecks', type: [match_dto_1.SpotcheckResponseDto] }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getPendingSpotchecks", null);
__decorate([
    (0, common_1.Put)('spotchecks/:id/assign'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assign spotcheck to user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Spotcheck assigned', type: match_dto_1.SpotcheckResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('assignedTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "assignSpotcheck", null);
exports.MatchesController = MatchesController = __decorate([
    (0, swagger_1.ApiTags)('Matches'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map