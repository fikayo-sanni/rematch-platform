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
var DatabaseSetupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSetupService = void 0;
const common_1 = require("@nestjs/common");
const ductape_config_1 = require("../config/ductape.config");
let DatabaseSetupService = DatabaseSetupService_1 = class DatabaseSetupService {
    ductape;
    logger = new common_1.Logger(DatabaseSetupService_1.name);
    constructor(ductape) {
        this.ductape = ductape;
    }
    async onModuleInit() {
        this.logger.log('Setting up database collections...');
        await this.setupCollections();
        await this.setupIndexes();
        this.logger.log('Database setup complete');
    }
    async setupCollections() {
        await this.ductape.createCollection('users', {
            id: { type: 'uuid', primaryKey: true },
            username: { type: 'string', maxLength: 50, required: true },
            email: { type: 'string', maxLength: 255, required: true },
            password: { type: 'string', required: true },
            avatar: { type: 'string' },
            bio: { type: 'text' },
            reputation: { type: 'float', default: 5.0 },
            xp: { type: 'integer', default: 0 },
            level: { type: 'integer', default: 1 },
            credits: {
                type: 'json',
                default: { rc: 0, bc: 0 },
            },
            isOnline: { type: 'boolean', default: false },
            lastSeen: { type: 'datetime' },
        }, { timestamps: true });
        await this.ductape.createCollection('guilds', {
            id: { type: 'uuid', primaryKey: true },
            name: { type: 'string', maxLength: 100, required: true },
            slug: { type: 'string', maxLength: 100, required: true },
            logo: { type: 'string' },
            banner: { type: 'string' },
            description: { type: 'text' },
            memberCount: { type: 'integer', default: 0 },
            activeNow: { type: 'integer', default: 0 },
            accentColor: { type: 'string', default: '#00FF00' },
        }, { timestamps: true });
        await this.ductape.createCollection('editions', {
            id: { type: 'uuid', primaryKey: true },
            guildId: { type: 'uuid', required: true },
            name: { type: 'string', maxLength: 100, required: true },
            year: { type: 'string', maxLength: 4 },
            isDefault: { type: 'boolean', default: false },
        }, { timestamps: true });
        await this.ductape.createCollection('user_guilds', {
            id: { type: 'uuid', primaryKey: true },
            userId: { type: 'uuid', required: true },
            guildId: { type: 'uuid', required: true },
            joinedAt: { type: 'datetime' },
        });
        await this.ductape.createCollection('pulls', {
            id: { type: 'uuid', primaryKey: true },
            guildId: { type: 'uuid', required: true },
            editionId: { type: 'uuid', required: true },
            creatorId: { type: 'uuid', required: true },
            opponentId: { type: 'uuid' },
            creditPot: { type: 'integer', required: true },
            status: {
                type: 'string',
                enum: ['pending', 'matched', 'expired', 'cancelled'],
            },
            expiresAt: { type: 'datetime' },
        }, { timestamps: true });
        await this.ductape.createCollection('calls', {
            id: { type: 'uuid', primaryKey: true },
            guildId: { type: 'uuid', required: true },
            editionId: { type: 'uuid', required: true },
            challengerId: { type: 'uuid', required: true },
            challengedId: { type: 'uuid', required: true },
            creditPot: { type: 'integer', required: true },
            message: { type: 'text' },
            status: {
                type: 'string',
                enum: ['pending', 'accepted', 'declined', 'expired'],
            },
            expiresAt: { type: 'datetime' },
        }, { timestamps: true });
        await this.ductape.createCollection('matches', {
            id: { type: 'uuid', primaryKey: true },
            type: {
                type: 'string',
                enum: ['pull', 'call', 'run', 'league', 'crew'],
            },
            status: {
                type: 'string',
                enum: [
                    'pending',
                    'accepted',
                    'in_progress',
                    'completed',
                    'disputed',
                    'cancelled',
                ],
            },
            guildId: { type: 'uuid', required: true },
            editionId: { type: 'uuid', required: true },
            player1Id: { type: 'uuid', required: true },
            player2Id: { type: 'uuid', required: true },
            creditPot: { type: 'integer', required: true },
            result: { type: 'json' },
            context: { type: 'json' },
            scheduledAt: { type: 'datetime' },
            startedAt: { type: 'datetime' },
            completedAt: { type: 'datetime' },
        }, { timestamps: true });
        await this.ductape.createCollection('runs', {
            id: { type: 'uuid', primaryKey: true },
            name: { type: 'string', maxLength: 200, required: true },
            type: {
                type: 'string',
                enum: ['daily', 'weekend', 'rank_push', 'crew', 'special'],
            },
            guildId: { type: 'uuid', required: true },
            editionId: { type: 'uuid', required: true },
            creditPot: { type: 'integer', required: true },
            participantCount: { type: 'integer', default: 0 },
            maxParticipants: { type: 'integer' },
            participants: { type: 'json', default: [] },
            status: {
                type: 'string',
                enum: ['upcoming', 'active', 'completed', 'cancelled'],
            },
            startsAt: { type: 'datetime' },
            endsAt: { type: 'datetime' },
        }, { timestamps: true });
        await this.ductape.createCollection('leagues', {
            id: { type: 'uuid', primaryKey: true },
            name: { type: 'string', maxLength: 200, required: true },
            description: { type: 'text' },
            guildId: { type: 'uuid', required: true },
            editionId: { type: 'uuid', required: true },
            creatorId: { type: 'uuid', required: true },
            type: { type: 'string', enum: ['round_robin', 'knockout', 'swiss'] },
            entryFee: { type: 'integer', default: 0 },
            prizePool: { type: 'integer', default: 0 },
            maxParticipants: { type: 'integer', required: true },
            participants: { type: 'json', default: [] },
            participantCount: { type: 'integer', default: 0 },
            matchesPerPlayer: { type: 'integer' },
            status: {
                type: 'string',
                enum: ['upcoming', 'active', 'completed', 'cancelled'],
            },
            standings: { type: 'json', default: [] },
            winnerId: { type: 'uuid' },
            startsAt: { type: 'datetime' },
            endsAt: { type: 'datetime' },
        }, { timestamps: true });
        await this.ductape.createCollection('crews', {
            id: { type: 'uuid', primaryKey: true },
            name: { type: 'string', maxLength: 100, required: true },
            tag: { type: 'string', maxLength: 10, required: true },
            logo: { type: 'string' },
            banner: { type: 'string' },
            description: { type: 'text' },
            guildId: { type: 'uuid' },
            leaderId: { type: 'uuid', required: true },
            members: { type: 'json', default: [] },
            memberCount: { type: 'integer', default: 1 },
            rank: { type: 'integer', default: 0 },
            wins: { type: 'integer', default: 0 },
            losses: { type: 'integer', default: 0 },
        }, { timestamps: true });
        await this.ductape.createCollection('crew_members', {
            id: { type: 'uuid', primaryKey: true },
            crewId: { type: 'uuid', required: true },
            userId: { type: 'uuid', required: true },
            role: { type: 'string', enum: ['leader', 'officer', 'member'] },
            joinedAt: { type: 'datetime' },
        });
        await this.ductape.createCollection('noise_posts', {
            id: { type: 'uuid', primaryKey: true },
            authorId: { type: 'uuid', required: true },
            guildId: { type: 'uuid' },
            content: { type: 'text', required: true },
            image: { type: 'string' },
            clipUrl: { type: 'string' },
            likes: { type: 'integer', default: 0 },
            replies: { type: 'integer', default: 0 },
            mentions: { type: 'json', default: [] },
        }, { timestamps: true });
        await this.ductape.createCollection('noise_replies', {
            id: { type: 'uuid', primaryKey: true },
            postId: { type: 'uuid', required: true },
            authorId: { type: 'uuid', required: true },
            content: { type: 'text', required: true },
            likes: { type: 'integer', default: 0 },
        }, { timestamps: true });
        await this.ductape.createCollection('noise_likes', {
            id: { type: 'uuid', primaryKey: true },
            postId: { type: 'uuid', required: true },
            userId: { type: 'uuid', required: true },
            createdAt: { type: 'datetime' },
        });
        await this.ductape.createCollection('reply_likes', {
            id: { type: 'uuid', primaryKey: true },
            replyId: { type: 'uuid', required: true },
            userId: { type: 'uuid', required: true },
            createdAt: { type: 'datetime' },
        });
        await this.ductape.createCollection('notifications', {
            id: { type: 'uuid', primaryKey: true },
            userId: { type: 'uuid', required: true },
            type: {
                type: 'string',
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
            },
            title: { type: 'string', required: true },
            message: { type: 'text', required: true },
            isRead: { type: 'boolean', default: false },
            data: { type: 'json' },
        }, { timestamps: true });
        await this.ductape.createCollection('spotchecks', {
            id: { type: 'uuid', primaryKey: true },
            matchId: { type: 'uuid', required: true },
            evidence: { type: 'json', default: [] },
            player1Claim: { type: 'json' },
            player2Claim: { type: 'json' },
            status: { type: 'string', enum: ['pending', 'reviewing', 'resolved'] },
            assignedToId: { type: 'uuid' },
            resolution: { type: 'json' },
        }, { timestamps: true });
        await this.ductape.createCollection('user_stats', {
            id: { type: 'uuid', primaryKey: true },
            userId: { type: 'uuid', required: true },
            guildId: { type: 'uuid', required: true },
            wins: { type: 'integer', default: 0 },
            losses: { type: 'integer', default: 0 },
            draws: { type: 'integer', default: 0 },
            winStreak: { type: 'integer', default: 0 },
            highestWinStreak: { type: 'integer', default: 0 },
            totalCreditsWon: { type: 'integer', default: 0 },
            totalCreditsLost: { type: 'integer', default: 0 },
        }, { timestamps: true });
        await this.ductape.createCollection('achievements', {
            id: { type: 'uuid', primaryKey: true },
            name: { type: 'string', required: true },
            description: { type: 'text' },
            icon: { type: 'string' },
            requirement: { type: 'json' },
            xpReward: { type: 'integer', default: 0 },
            creditReward: { type: 'json' },
        });
        await this.ductape.createCollection('user_achievements', {
            id: { type: 'uuid', primaryKey: true },
            userId: { type: 'uuid', required: true },
            achievementId: { type: 'uuid', required: true },
            unlockedAt: { type: 'datetime' },
        });
        await this.ductape.createCollection('activities', {
            id: { type: 'uuid', primaryKey: true },
            userId: { type: 'uuid', required: true },
            type: {
                type: 'string',
                enum: [
                    'match_won',
                    'match_lost',
                    'rank_achieved',
                    'guild_joined',
                    'crew_joined',
                    'tournament_won',
                    'achievement_unlocked',
                ],
            },
            description: { type: 'text' },
            data: { type: 'json' },
        }, { timestamps: true });
        await this.ductape.createCollection('sessions', {
            id: { type: 'uuid', primaryKey: true },
            userId: { type: 'uuid', required: true },
            token: { type: 'string', required: true },
            expiresAt: { type: 'datetime' },
            createdAt: { type: 'datetime' },
        });
        await this.ductape.createCollection('live_matches', {
            id: { type: 'uuid', primaryKey: true },
            matchId: { type: 'uuid', required: true },
            player1Score: { type: 'integer', default: 0 },
            player2Score: { type: 'integer', default: 0 },
            events: { type: 'json', default: [] },
            spectatorCount: { type: 'integer', default: 0 },
            startedAt: { type: 'datetime' },
        }, { timestamps: true });
        this.logger.log('All collections created');
    }
    async setupIndexes() {
        await this.ductape.createIndex('users', ['username'], { unique: true });
        await this.ductape.createIndex('users', ['email'], { unique: true });
        await this.ductape.createIndex('users', ['isOnline']);
        await this.ductape.createIndex('guilds', ['slug'], { unique: true });
        await this.ductape.createIndex('user_guilds', ['userId', 'guildId'], {
            unique: true,
        });
        await this.ductape.createIndex('pulls', ['status']);
        await this.ductape.createIndex('pulls', ['guildId', 'status']);
        await this.ductape.createIndex('pulls', ['creatorId']);
        await this.ductape.createIndex('calls', ['challengerId']);
        await this.ductape.createIndex('calls', ['challengedId']);
        await this.ductape.createIndex('calls', ['status']);
        await this.ductape.createIndex('matches', ['player1Id']);
        await this.ductape.createIndex('matches', ['player2Id']);
        await this.ductape.createIndex('matches', ['status']);
        await this.ductape.createIndex('matches', ['guildId']);
        await this.ductape.createIndex('runs', ['guildId']);
        await this.ductape.createIndex('runs', ['status']);
        await this.ductape.createIndex('leagues', ['guildId']);
        await this.ductape.createIndex('leagues', ['status']);
        await this.ductape.createIndex('crews', ['tag'], { unique: true });
        await this.ductape.createIndex('crews', ['leaderId']);
        await this.ductape.createIndex('crew_members', ['crewId']);
        await this.ductape.createIndex('crew_members', ['userId']);
        await this.ductape.createIndex('noise_posts', ['authorId']);
        await this.ductape.createIndex('noise_posts', ['guildId']);
        await this.ductape.createIndex('notifications', ['userId']);
        await this.ductape.createIndex('notifications', ['userId', 'isRead']);
        await this.ductape.createIndex('user_stats', ['userId', 'guildId'], {
            unique: true,
        });
        await this.ductape.createIndex('activities', ['userId']);
        await this.ductape.createIndex('sessions', ['token'], { unique: true });
        await this.ductape.createIndex('sessions', ['userId']);
        await this.ductape.createIndex('sessions', ['expiresAt']);
        await this.ductape.createIndex('live_matches', ['matchId'], {
            unique: true,
        });
        this.logger.log('All indexes created');
    }
};
exports.DatabaseSetupService = DatabaseSetupService;
exports.DatabaseSetupService = DatabaseSetupService = DatabaseSetupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ductape_config_1.DuctapeService])
], DatabaseSetupService);
//# sourceMappingURL=database-setup.service.js.map