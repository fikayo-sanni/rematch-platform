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
exports.GuildsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guilds_service_1 = require("./guilds.service");
const guild_dto_1 = require("./dto/guild.dto");
let GuildsController = class GuildsController {
    guildsService;
    constructor(guildsService) {
        this.guildsService = guildsService;
    }
    async create(dto) {
        return this.guildsService.create(dto);
    }
    async findAll(limit, skip) {
        return this.guildsService.findAll({
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
        });
    }
    async findById(id) {
        return this.guildsService.findById(id);
    }
    async findBySlug(slug) {
        return this.guildsService.findBySlug(slug);
    }
    async update(id, dto) {
        return this.guildsService.update(id, dto);
    }
    async delete(id) {
        return this.guildsService.delete(id);
    }
    async join(id, dto) {
        return this.guildsService.join(id, dto);
    }
    async leave(id, userId) {
        return this.guildsService.leave(id, userId);
    }
    async getMembers(id, limit, skip) {
        return this.guildsService.getGuildMembers(id, {
            limit: limit ? Number(limit) : undefined,
            skip: skip ? Number(skip) : undefined,
        });
    }
    async getUserGuilds(userId) {
        return this.guildsService.getUserGuilds(userId);
    }
    async checkMembership(id, userId) {
        const isMember = await this.guildsService.isGuildMember(userId, id);
        return { isMember };
    }
    async setActiveEdition(id, userId, editionId) {
        return this.guildsService.setActiveEdition(userId, id, editionId);
    }
    async getActiveNow(id) {
        const activeNow = await this.guildsService.getActiveNow(id);
        return { activeNow };
    }
    async refreshActiveNow(id) {
        const activeNow = await this.guildsService.updateActiveNow(id);
        return { activeNow };
    }
};
exports.GuildsController = GuildsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new guild (game)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Guild created', type: guild_dto_1.GuildResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Guild slug already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [guild_dto_1.CreateGuildDto]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all guilds' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of guilds', type: [guild_dto_1.GuildResponseDto] }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get guild by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guild details', type: guild_dto_1.GuildResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Guild not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get guild by slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guild details', type: guild_dto_1.GuildResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Guild not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update guild' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guild updated', type: guild_dto_1.GuildResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Guild not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, guild_dto_1.UpdateGuildDto]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete guild' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Guild deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Guild not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Join a guild' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Joined guild', type: guild_dto_1.UserGuildResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Guild not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Already a member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, guild_dto_1.JoinGuildDto]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "join", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Leave a guild' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Left guild' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Guild or membership not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "leave", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Get guild members' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of members' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get guilds for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User guilds', type: [guild_dto_1.UserGuildResponseDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "getUserGuilds", null);
__decorate([
    (0, common_1.Get)(':id/membership/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user is a member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "checkMembership", null);
__decorate([
    (0, common_1.Put)(':id/edition/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Set active edition for user in guild' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Edition updated', type: guild_dto_1.UserGuildResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)('editionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "setActiveEdition", null);
__decorate([
    (0, common_1.Get)(':id/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active user count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active count' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "getActiveNow", null);
__decorate([
    (0, common_1.Post)(':id/refresh-active'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh active user count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active count refreshed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuildsController.prototype, "refreshActiveNow", null);
exports.GuildsController = GuildsController = __decorate([
    (0, swagger_1.ApiTags)('Guilds'),
    (0, common_1.Controller)('guilds'),
    __metadata("design:paramtypes", [guilds_service_1.GuildsService])
], GuildsController);
//# sourceMappingURL=guilds.controller.js.map