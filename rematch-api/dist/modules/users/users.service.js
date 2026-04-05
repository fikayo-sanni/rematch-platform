"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const ductape_config_1 = require("../../config/ductape.config");
const graph_setup_service_1 = require("../../database/graph-setup.service");
const uuid_1 = require("uuid");
const crypto = __importStar(require("crypto"));
let UsersService = UsersService_1 = class UsersService {
    ductape;
    graphService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(ductape, graphService) {
        this.ductape = ductape;
        this.graphService = graphService;
    }
    async register(dto) {
        const existingEmail = await this.ductape.dbFindOne('users', { email: dto.email });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        const existingUsername = await this.ductape.dbFindOne('users', { username: dto.username });
        if (existingUsername) {
            throw new common_1.ConflictException('Username already taken');
        }
        const userId = (0, uuid_1.v4)();
        const hashedPassword = this.hashPassword(dto.password);
        const user = {
            id: userId,
            username: dto.username,
            email: dto.email,
            password: hashedPassword,
            avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${userId}`,
            bio: dto.bio || '',
            reputation: 5.0,
            xp: 0,
            level: 1,
            credits: { rc: 500, bc: 50 },
            isOnline: true,
            createdAt: new Date(),
        };
        await this.ductape.dbInsert('users', user);
        await this.graphService.createUserNode(userId, user.username, user.level, user.reputation, true);
        await this.ductape.dbInsert('user_stats', {
            id: (0, uuid_1.v4)(),
            userId,
            guildId: 'global',
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
        const token = await this.createSession(userId);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async login(dto) {
        const user = await this.ductape.dbFindOne('users', { email: dto.email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const hashedPassword = this.hashPassword(dto.password);
        if (user.password !== hashedPassword) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.ductape.dbUpdate('users', { id: user.id }, { $set: { isOnline: true } });
        await this.graphService.createUserNode(user.id, user.username, user.level, user.reputation, true);
        const token = await this.createSession(user.id);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async logout(userId, token) {
        await this.ductape.dbUpdate('users', { id: userId }, { $set: { isOnline: false, lastSeen: new Date() } });
        await this.ductape.dbDelete('sessions', { token });
        return { success: true };
    }
    async validateSession(token) {
        const session = await this.ductape.dbFindOne('sessions', { token });
        if (!session || new Date(session.expiresAt) < new Date()) {
            return null;
        }
        return this.findById(session.userId);
    }
    async createSession(userId) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.ductape.dbInsert('sessions', {
            id: (0, uuid_1.v4)(),
            userId,
            token,
            expiresAt,
            createdAt: new Date(),
        });
        return token;
    }
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    async findById(id) {
        const user = await this.ductape.dbFindOne('users', { id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findByUsername(username) {
        const user = await this.ductape.dbFindOne('users', { username });
        if (!user) {
            throw new common_1.NotFoundException(`User @${username} not found`);
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findAll(options = {}) {
        const query = {};
        if (options.isOnline !== undefined) {
            query.isOnline = options.isOnline;
        }
        const users = await this.ductape.dbFindMany('users', query, {
            limit: options.limit || 50,
            skip: options.skip || 0,
            sort: { level: -1 },
        });
        return users.map(({ password: _, ...user }) => user);
    }
    async update(id, dto) {
        const user = await this.findById(id);
        if (dto.username && dto.username !== user.username) {
            const existing = await this.ductape.dbFindOne('users', { username: dto.username });
            if (existing) {
                throw new common_1.ConflictException('Username already taken');
            }
        }
        await this.ductape.dbUpdate('users', { id }, { $set: dto });
        if (dto.username) {
            await this.graphService.createUserNode(id, dto.username, user.level, user.reputation, user.isOnline);
        }
        return this.findById(id);
    }
    async updateCredits(userId, dto) {
        const user = await this.findById(userId);
        const creditField = `credits.${dto.type}`;
        const currentCredits = user.credits[dto.type];
        let newAmount;
        if (dto.operation === 'add') {
            newAmount = currentCredits + dto.amount;
        }
        else {
            if (currentCredits < dto.amount) {
                throw new common_1.ConflictException('Insufficient credits');
            }
            newAmount = currentCredits - dto.amount;
        }
        await this.ductape.dbUpdate('users', { id: userId }, {
            $set: { [creditField]: newAmount },
        });
        return this.findById(userId);
    }
    async addXP(userId, amount) {
        const user = await this.findById(userId);
        const newXP = user.xp + amount;
        const newLevel = this.calculateLevel(newXP);
        await this.ductape.dbUpdate('users', { id: userId }, {
            $set: { xp: newXP, level: newLevel },
        });
        if (newLevel > user.level) {
            this.logger.log(`User ${userId} leveled up to level ${newLevel}`);
        }
        return this.findById(userId);
    }
    calculateLevel(xp) {
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }
    async getRankboard(guildId, options = {}) {
        const stats = await this.ductape.dbFindMany('user_stats', { guildId }, {
            limit: options.limit || 50,
            skip: options.skip || 0,
            sort: { wins: -1, creditsEarned: -1 },
        });
        const rankEntries = await Promise.all(stats.map(async (stat, index) => {
            const user = await this.findById(stat.userId);
            const previousRank = await this.getPreviousRank(stat.userId, guildId);
            return {
                rank: (options.skip || 0) + index + 1,
                user,
                wins: stat.wins,
                losses: stat.losses,
                creditsEarned: stat.creditsEarned,
                winStreak: stat.currentStreak,
                change: previousRank ? previousRank - ((options.skip || 0) + index + 1) : 0,
            };
        }));
        return rankEntries;
    }
    async getUserRank(userId, guildId) {
        const allStats = await this.ductape.dbFindMany('user_stats', { guildId }, { sort: { wins: -1, creditsEarned: -1 } });
        const rank = allStats.findIndex((s) => s.userId === userId) + 1;
        const userStats = allStats.find((s) => s.userId === userId);
        if (!userStats) {
            return null;
        }
        const user = await this.findById(userId);
        return {
            rank,
            user,
            wins: userStats.wins,
            losses: userStats.losses,
            creditsEarned: userStats.creditsEarned,
            winStreak: userStats.currentStreak,
            change: 0,
        };
    }
    async getPreviousRank(userId, guildId) {
        return null;
    }
    async getUserStats(userId, guildId) {
        const query = { userId };
        if (guildId) {
            query.guildId = guildId;
        }
        const stats = await this.ductape.dbFindMany('user_stats', query);
        if (stats.length === 0) {
            return {
                userId,
                totalMatches: 0,
                wins: 0,
                losses: 0,
                winRate: 0,
                currentStreak: 0,
                bestStreak: 0,
                totalPlayTime: 0,
                creditsEarned: 0,
                tournamentWins: 0,
            };
        }
        const aggregated = stats.reduce((acc, stat) => ({
            totalMatches: acc.totalMatches + stat.totalMatches,
            wins: acc.wins + stat.wins,
            losses: acc.losses + stat.losses,
            currentStreak: Math.max(acc.currentStreak, stat.currentStreak),
            bestStreak: Math.max(acc.bestStreak, stat.bestStreak),
            totalPlayTime: acc.totalPlayTime + stat.totalPlayTime,
            creditsEarned: acc.creditsEarned + stat.creditsEarned,
            tournamentWins: acc.tournamentWins + stat.tournamentWins,
        }), {
            totalMatches: 0,
            wins: 0,
            losses: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalPlayTime: 0,
            creditsEarned: 0,
            tournamentWins: 0,
        });
        return {
            userId,
            ...aggregated,
            winRate: aggregated.totalMatches > 0
                ? Math.round((aggregated.wins / aggregated.totalMatches) * 1000) / 10
                : 0,
        };
    }
    async updateUserStats(userId, guildId, updates) {
        const existingStats = await this.ductape.dbFindOne('user_stats', { userId, guildId });
        if (!existingStats) {
            await this.ductape.dbInsert('user_stats', {
                id: (0, uuid_1.v4)(),
                userId,
                guildId,
                totalMatches: updates.won !== undefined ? 1 : 0,
                wins: updates.won ? 1 : 0,
                losses: updates.won === false ? 1 : 0,
                currentStreak: updates.won ? 1 : 0,
                bestStreak: updates.won ? 1 : 0,
                totalPlayTime: updates.playTime || 0,
                creditsEarned: updates.creditsEarned || 0,
                tournamentWins: updates.tournamentWin ? 1 : 0,
                matchTypeBreakdown: [],
            });
        }
        else {
            const updateOps = { $inc: {} };
            if (updates.won !== undefined) {
                updateOps.$inc.totalMatches = 1;
                if (updates.won) {
                    updateOps.$inc.wins = 1;
                    const newStreak = existingStats.currentStreak + 1;
                    updateOps.$set = {
                        currentStreak: newStreak,
                        bestStreak: Math.max(existingStats.bestStreak, newStreak),
                    };
                }
                else {
                    updateOps.$inc.losses = 1;
                    updateOps.$set = { currentStreak: 0 };
                }
            }
            if (updates.playTime) {
                updateOps.$inc.totalPlayTime = updates.playTime;
            }
            if (updates.creditsEarned) {
                updateOps.$inc.creditsEarned = updates.creditsEarned;
            }
            if (updates.tournamentWin) {
                updateOps.$inc.tournamentWins = 1;
            }
            await this.ductape.dbUpdate('user_stats', { userId, guildId }, updateOps);
        }
        return this.getUserStats(userId, guildId);
    }
    async getOnlineUsers(limit = 20) {
        return this.findAll({ limit, isOnline: true });
    }
    async setOnlineStatus(userId, isOnline) {
        await this.ductape.dbUpdate('users', { id: userId }, {
            $set: { isOnline, lastSeen: isOnline ? undefined : new Date() },
        });
        const user = await this.findById(userId);
        await this.graphService.createUserNode(userId, user.username, user.level, user.reputation, isOnline);
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ductape_config_1.DuctapeService,
        graph_setup_service_1.GraphSetupService])
], UsersService);
//# sourceMappingURL=users.service.js.map