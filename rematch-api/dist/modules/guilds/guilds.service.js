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
var GuildsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildsService = void 0;
const common_1 = require("@nestjs/common");
const ductape_config_1 = require("../../config/ductape.config");
const graph_setup_service_1 = require("../../database/graph-setup.service");
const uuid_1 = require("uuid");
let GuildsService = GuildsService_1 = class GuildsService {
    ductape;
    graphService;
    logger = new common_1.Logger(GuildsService_1.name);
    constructor(ductape, graphService) {
        this.ductape = ductape;
        this.graphService = graphService;
    }
    async create(dto) {
        const existingSlug = await this.ductape.dbFindOne('guilds', { slug: dto.slug });
        if (existingSlug) {
            throw new common_1.ConflictException(`Guild with slug '${dto.slug}' already exists`);
        }
        const guildId = (0, uuid_1.v4)();
        const guild = {
            id: guildId,
            name: dto.name,
            slug: dto.slug,
            logo: dto.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${dto.name}`,
            banner: dto.banner,
            description: dto.description,
            editions: dto.editions,
            memberCount: 0,
            activeNow: 0,
            accentColor: dto.accentColor || '#00FF87',
            createdAt: new Date(),
        };
        await this.ductape.dbInsert('guilds', guild);
        await this.graphService.createGuildNode(guildId, guild.name, guild.slug, guild.accentColor);
        this.logger.log(`Created guild: ${guild.name} (${guildId})`);
        return guild;
    }
    async findById(id) {
        const guild = await this.ductape.dbFindOne('guilds', { id });
        if (!guild) {
            throw new common_1.NotFoundException(`Guild with ID ${id} not found`);
        }
        return guild;
    }
    async findBySlug(slug) {
        const guild = await this.ductape.dbFindOne('guilds', { slug });
        if (!guild) {
            throw new common_1.NotFoundException(`Guild '${slug}' not found`);
        }
        return guild;
    }
    async findAll(options = {}) {
        return this.ductape.dbFindMany('guilds', {}, {
            limit: options.limit || 50,
            skip: options.skip || 0,
            sort: { memberCount: -1 },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        await this.ductape.dbUpdate('guilds', { id }, { $set: dto });
        const updated = await this.findById(id);
        if (dto.name || dto.accentColor) {
            await this.graphService.createGuildNode(id, updated.name, updated.slug, updated.accentColor);
        }
        return updated;
    }
    async delete(id) {
        await this.findById(id);
        await this.ductape.dbDelete('user_guilds', { guildId: id });
        await this.ductape.dbDelete('guilds', { id });
        this.logger.log(`Deleted guild: ${id}`);
        return { success: true };
    }
    async join(guildId, dto) {
        const guild = await this.findById(guildId);
        const existing = await this.ductape.dbFindOne('user_guilds', {
            userId: dto.userId,
            guildId,
        });
        if (existing) {
            throw new common_1.ConflictException('User is already a member of this guild');
        }
        const activeEditionId = dto.activeEditionId ||
            guild.editions.find((e) => e.isDefault)?.id ||
            guild.editions[0]?.id;
        const membership = {
            id: (0, uuid_1.v4)(),
            userId: dto.userId,
            guildId,
            activeEditionId,
            joinedAt: new Date(),
        };
        await this.ductape.dbInsert('user_guilds', membership);
        await this.ductape.dbUpdate('guilds', { id: guildId }, {
            $inc: { memberCount: 1 },
        });
        await this.graphService.userJoinsGuild(dto.userId, guildId);
        await this.ductape.dbInsert('user_stats', {
            id: (0, uuid_1.v4)(),
            userId: dto.userId,
            guildId,
            totalMatches: 0,
            wins: 0,
            losses: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalPlayTime: 0,
            creditsEarned: 0,
            tournamentWins: 0,
            matchTypeBreakdown: [],
        });
        this.logger.log(`User ${dto.userId} joined guild ${guildId}`);
        return { ...membership, guild };
    }
    async leave(guildId, userId) {
        await this.findById(guildId);
        const membership = await this.ductape.dbFindOne('user_guilds', { userId, guildId });
        if (!membership) {
            throw new common_1.NotFoundException('User is not a member of this guild');
        }
        await this.ductape.dbDelete('user_guilds', { userId, guildId });
        await this.ductape.dbUpdate('guilds', { id: guildId }, {
            $inc: { memberCount: -1 },
        });
        await this.graphService.userLeavesGuild(userId, guildId);
        this.logger.log(`User ${userId} left guild ${guildId}`);
        return { success: true };
    }
    async getUserGuilds(userId) {
        const memberships = await this.ductape.dbFindMany('user_guilds', { userId });
        const guildsWithDetails = await Promise.all(memberships.map(async (m) => {
            const guild = await this.findById(m.guildId);
            return {
                guildId: m.guildId,
                guild,
                joinedAt: m.joinedAt,
                activeEditionId: m.activeEditionId,
            };
        }));
        return guildsWithDetails;
    }
    async getGuildMembers(guildId, options = {}) {
        await this.findById(guildId);
        const memberships = await this.ductape.dbFindMany('user_guilds', { guildId }, {
            limit: options.limit || 50,
            skip: options.skip || 0,
        });
        const members = await Promise.all(memberships.map(async (m) => {
            const user = await this.ductape.dbFindOne('users', { id: m.userId });
            if (!user)
                return null;
            const { password: _, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                joinedAt: m.joinedAt,
                activeEditionId: m.activeEditionId,
            };
        }));
        return members.filter(Boolean);
    }
    async isGuildMember(userId, guildId) {
        const membership = await this.ductape.dbFindOne('user_guilds', { userId, guildId });
        return !!membership;
    }
    async setActiveEdition(userId, guildId, editionId) {
        const guild = await this.findById(guildId);
        const editionExists = guild.editions.some((e) => e.id === editionId);
        if (!editionExists) {
            throw new common_1.NotFoundException(`Edition '${editionId}' not found in guild`);
        }
        await this.ductape.dbUpdate('user_guilds', { userId, guildId }, {
            $set: { activeEditionId: editionId },
        });
        return this.getUserMembership(userId, guildId);
    }
    async getUserMembership(userId, guildId) {
        const membership = await this.ductape.dbFindOne('user_guilds', { userId, guildId });
        if (!membership) {
            return null;
        }
        const guild = await this.findById(guildId);
        return {
            guildId: membership.guildId,
            guild,
            joinedAt: membership.joinedAt,
            activeEditionId: membership.activeEditionId,
        };
    }
    async updateActiveNow(guildId) {
        const memberships = await this.ductape.dbFindMany('user_guilds', { guildId });
        const userIds = memberships.map((m) => m.userId);
        const onlineCount = await this.ductape.dbCount('users', {
            id: { $in: userIds },
            isOnline: true,
        });
        await this.ductape.dbUpdate('guilds', { id: guildId }, {
            $set: { activeNow: onlineCount },
        });
        return onlineCount;
    }
    async getActiveNow(guildId) {
        const guild = await this.findById(guildId);
        return guild.activeNow;
    }
};
exports.GuildsService = GuildsService;
exports.GuildsService = GuildsService = GuildsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ductape_config_1.DuctapeService,
        graph_setup_service_1.GraphSetupService])
], GuildsService);
//# sourceMappingURL=guilds.service.js.map