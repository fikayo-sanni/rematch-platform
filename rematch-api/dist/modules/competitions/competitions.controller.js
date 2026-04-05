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
exports.CompetitionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const competitions_service_1 = require("./competitions.service");
const competition_dto_1 = require("./dto/competition.dto");
let CompetitionsController = class CompetitionsController {
    competitionsService;
    constructor(competitionsService) {
        this.competitionsService = competitionsService;
    }
    async createRun(dto) {
        return this.competitionsService.createRun(dto);
    }
    async joinRun(id, dto) {
        return this.competitionsService.joinRun(id, dto.userId);
    }
    async leaveRun(id, dto) {
        return this.competitionsService.leaveRun(id, dto.userId);
    }
    async startRun(id) {
        return this.competitionsService.startRun(id);
    }
    async endRun(id, winnerId) {
        return this.competitionsService.endRun(id, winnerId);
    }
    async getRun(id) {
        return this.competitionsService.getRun(id);
    }
    async getRuns(guildId, type, isActive) {
        return this.competitionsService.getRuns({
            guildId,
            type,
            isActive: isActive !== undefined ? isActive === 'true' : undefined,
        });
    }
    async getActiveRuns(guildId) {
        return this.competitionsService.getActiveRuns(guildId);
    }
    async getUpcomingRuns(guildId) {
        return this.competitionsService.getUpcomingRuns(guildId);
    }
    async getUserRuns(userId) {
        return this.competitionsService.getUserRuns(userId);
    }
    async createLeague(dto) {
        return this.competitionsService.createLeague(dto);
    }
    async joinLeague(id, dto) {
        return this.competitionsService.joinLeague(id, dto.userId);
    }
    async startLeague(id) {
        return this.competitionsService.startLeague(id);
    }
    async updateStandings(id, dto) {
        return this.competitionsService.updateStandings(id, dto);
    }
    async endLeague(id) {
        return this.competitionsService.endLeague(id);
    }
    async getLeague(id) {
        return this.competitionsService.getLeague(id);
    }
    async getLeagues(guildId, status, type) {
        return this.competitionsService.getLeagues({ guildId, status, type });
    }
    async getUserLeagues(userId) {
        return this.competitionsService.getUserLeagues(userId);
    }
};
exports.CompetitionsController = CompetitionsController;
__decorate([
    (0, common_1.Post)('runs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a tournament' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tournament created', type: competition_dto_1.RunResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [competition_dto_1.CreateRunDto]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "createRun", null);
__decorate([
    (0, common_1.Post)('runs/:id/join'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Join a tournament' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Joined tournament', type: competition_dto_1.RunResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, competition_dto_1.JoinCompetitionDto]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "joinRun", null);
__decorate([
    (0, common_1.Post)('runs/:id/leave'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Leave a tournament' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, competition_dto_1.JoinCompetitionDto]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "leaveRun", null);
__decorate([
    (0, common_1.Post)('runs/:id/start'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start a tournament' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "startRun", null);
__decorate([
    (0, common_1.Post)('runs/:id/end'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'End a tournament' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('winnerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "endRun", null);
__decorate([
    (0, common_1.Get)('runs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tournament by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "getRun", null);
__decorate([
    (0, common_1.Get)('runs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tournaments' }),
    (0, swagger_1.ApiQuery)({ name: 'guildId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false }),
    __param(0, (0, common_1.Query)('guildId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "getRuns", null);
__decorate([
    (0, common_1.Get)('runs/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active tournaments' }),
    __param(0, (0, common_1.Query)('guildId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "getActiveRuns", null);
__decorate([
    (0, common_1.Get)('runs/upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming tournaments' }),
    __param(0, (0, common_1.Query)('guildId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "getUpcomingRuns", null);
__decorate([
    (0, common_1.Get)('runs/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user tournaments' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "getUserRuns", null);
__decorate([
    (0, common_1.Post)('leagues'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a league' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [competition_dto_1.CreateLeagueDto]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "createLeague", null);
__decorate([
    (0, common_1.Post)('leagues/:id/join'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Join a league' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, competition_dto_1.JoinCompetitionDto]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "joinLeague", null);
__decorate([
    (0, common_1.Post)('leagues/:id/start'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Start a league' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "startLeague", null);
__decorate([
    (0, common_1.Put)('leagues/:id/standings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update league standings after a match' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, competition_dto_1.UpdateStandingsDto]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "updateStandings", null);
__decorate([
    (0, common_1.Post)('leagues/:id/end'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'End a league' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "endLeague", null);
__decorate([
    (0, common_1.Get)('leagues/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get league by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "getLeague", null);
__decorate([
    (0, common_1.Get)('leagues'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leagues' }),
    (0, swagger_1.ApiQuery)({ name: 'guildId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false }),
    __param(0, (0, common_1.Query)('guildId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "getLeagues", null);
__decorate([
    (0, common_1.Get)('leagues/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user leagues' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompetitionsController.prototype, "getUserLeagues", null);
exports.CompetitionsController = CompetitionsController = __decorate([
    (0, swagger_1.ApiTags)('Competitions'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [competitions_service_1.CompetitionsService])
], CompetitionsController);
//# sourceMappingURL=competitions.controller.js.map