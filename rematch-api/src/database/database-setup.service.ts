import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DuctapeService } from '../config/ductape.config';

@Injectable()
export class DatabaseSetupService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSetupService.name);

  constructor(private readonly ductape: DuctapeService) {}

  async onModuleInit() {
    this.logger.log('Setting up database collections...');
    await this.setupCollections();
    await this.setupIndexes();
    this.logger.log('Database setup complete');
  }

  private async setupCollections() {
    const existingCollections = await this.ductape.listCollections().catch(() => [] as string[]);
    const exists = (name: string) => existingCollections.includes(name);

    // ── Users ──────────────────────────────────────────────────────────────
    if (!exists('users')) {
      await this.ductape.createCollection(
        'users',
        {
          id: { type: 'uuid', primaryKey: true },
          username: { type: 'string', maxLength: 50, required: true },
          email: { type: 'string', maxLength: 255, required: true },
          password: { type: 'string', required: true },
          avatar: { type: 'string' },
          bio: { type: 'text' },
          reputation: { type: 'float', default: 5.0 },
          xp: { type: 'integer', default: 0 },
          level: { type: 'integer', default: 1 },
          credits: { type: 'json', default: { rc: 500, bc: 50 } },
          isOnline: { type: 'boolean', default: false },
          lastSeen: { type: 'datetime' },
        },
        { timestamps: true },
      );
    }

    // ── Guilds (Games) ─────────────────────────────────────────────────────
    if (!exists('guilds')) {
      await this.ductape.createCollection(
        'guilds',
        {
          id: { type: 'uuid', primaryKey: true },
          name: { type: 'string', maxLength: 100, required: true },
          slug: { type: 'string', maxLength: 100, required: true },
          logo: { type: 'string' },
          banner: { type: 'string' },
          description: { type: 'text' },
          // editions stored as embedded JSON array on guild
          editions: { type: 'json', default: [] },
          memberCount: { type: 'integer', default: 0 },
          activeNow: { type: 'integer', default: 0 },
          accentColor: { type: 'string', default: '#00FF00' },
        },
        { timestamps: true },
      );
    }

    // ── User-Guild membership ──────────────────────────────────────────────
    if (!exists('user_guilds')) {
      await this.ductape.createCollection('user_guilds', {
        id: { type: 'uuid', primaryKey: true },
        userId: { type: 'uuid', required: true },
        guildId: { type: 'uuid', required: true },
        activeEditionId: { type: 'uuid' },
        joinedAt: { type: 'datetime' },
      });
    }

    // ── Pulls (Quick Matches) ──────────────────────────────────────────────
    // NOTE: field is `initiatorId` (not `creatorId`) to match matches.service.ts
    if (!exists('pulls')) {
      await this.ductape.createCollection(
        'pulls',
        {
          id: { type: 'uuid', primaryKey: true },
          guildId: { type: 'uuid', required: true },
          editionId: { type: 'uuid', required: true },
          initiatorId: { type: 'uuid', required: true },
          opponentId: { type: 'uuid' },
          creditPot: { type: 'integer', required: true },
          status: {
            type: 'string',
            enum: ['pending', 'accepted', 'declined', 'expired', 'cancelled'],
          },
          expiresAt: { type: 'datetime' },
        },
        { timestamps: true },
      );
    }

    // ── Calls (Challenges) ─────────────────────────────────────────────────
    if (!exists('calls')) {
      await this.ductape.createCollection(
        'calls',
        {
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
        },
        { timestamps: true },
      );
    }

    // ── Matches ────────────────────────────────────────────────────────────
    if (!exists('matches')) {
      await this.ductape.createCollection(
        'matches',
        {
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
        },
        { timestamps: true },
      );
    }

    // ── Live Matches ─────────────────────────────────────────────────────
    // score stored as JSON object { player1: number, player2: number }
    if (!exists('live_matches')) {
      await this.ductape.createCollection(
        'live_matches',
        {
          id: { type: 'uuid', primaryKey: true },
          matchId: { type: 'uuid', required: true },
          score: { type: 'json', default: { player1: 0, player2: 0 } },
          viewers: { type: 'integer', default: 0 },
          duration: { type: 'string', default: '00:00' },
          isLive: { type: 'boolean', default: true },
          startedAt: { type: 'datetime' },
        },
        { timestamps: true },
      );
    }

    // ── Runs (Tournaments) ─────────────────────────────────────────────────
    if (!exists('runs')) {
      await this.ductape.createCollection(
        'runs',
        {
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
          participantIds: { type: 'json', default: [] },
          isActive: { type: 'boolean', default: false },
          winnerId: { type: 'uuid' },
          startsAt: { type: 'datetime' },
          endsAt: { type: 'datetime' },
        },
        { timestamps: true },
      );
    }

    // ── Leagues ────────────────────────────────────────────────────────────
    if (!exists('leagues')) {
      await this.ductape.createCollection(
        'leagues',
        {
          id: { type: 'uuid', primaryKey: true },
          name: { type: 'string', maxLength: 200, required: true },
          description: { type: 'text' },
          guildId: { type: 'uuid', required: true },
          editionId: { type: 'uuid', required: true },
          type: { type: 'string', enum: ['round_robin', 'knockout', 'swiss'] },
          status: {
            type: 'string',
            enum: ['upcoming', 'active', 'completed', 'cancelled'],
          },
          entryFee: { type: 'integer', default: 0 },
          prizePool: { type: 'integer', default: 0 },
          maxParticipants: { type: 'integer', required: true },
          matchesPerPlayer: { type: 'integer' },
          participantIds: { type: 'json', default: [] },
          participantCount: { type: 'integer', default: 0 },
          standings: { type: 'json', default: [] },
          winnerId: { type: 'uuid' },
          startsAt: { type: 'datetime' },
          endsAt: { type: 'datetime' },
        },
        { timestamps: true },
      );
    }

    // ── Crews (Teams) ──────────────────────────────────────────────────────
    if (!exists('crews')) {
      await this.ductape.createCollection(
        'crews',
        {
          id: { type: 'uuid', primaryKey: true },
          name: { type: 'string', maxLength: 100, required: true },
          tag: { type: 'string', maxLength: 10, required: true },
          logo: { type: 'string' },
          banner: { type: 'string' },
          description: { type: 'text' },
          guildId: { type: 'uuid' },
          leaderId: { type: 'uuid', required: true },
          memberIds: { type: 'json', default: [] },
          memberCount: { type: 'integer', default: 1 },
          rank: { type: 'integer', default: 0 },
          wins: { type: 'integer', default: 0 },
          losses: { type: 'integer', default: 0 },
        },
        { timestamps: true },
      );
    }

    // ── Crew Members ───────────────────────────────────────────────────────
    if (!exists('crew_members')) {
      await this.ductape.createCollection('crew_members', {
        id: { type: 'uuid', primaryKey: true },
        crewId: { type: 'uuid', required: true },
        userId: { type: 'uuid', required: true },
        role: { type: 'string', enum: ['leader', 'officer', 'member'] },
        joinedAt: { type: 'datetime' },
      });
    }

    // ── Noise Posts (Feed) ─────────────────────────────────────────────────
    if (!exists('noise_posts')) {
      await this.ductape.createCollection(
        'noise_posts',
        {
          id: { type: 'uuid', primaryKey: true },
          authorId: { type: 'uuid', required: true },
          guildId: { type: 'uuid' },
          content: { type: 'text', required: true },
          image: { type: 'string' },
          clipUrl: { type: 'string' },
          likes: { type: 'integer', default: 0 },
          replies: { type: 'integer', default: 0 },
          mentions: { type: 'json', default: [] },
        },
        { timestamps: true },
      );
    }

    // ── Noise Replies ──────────────────────────────────────────────────────
    if (!exists('noise_replies')) {
      await this.ductape.createCollection(
        'noise_replies',
        {
          id: { type: 'uuid', primaryKey: true },
          postId: { type: 'uuid', required: true },
          authorId: { type: 'uuid', required: true },
          content: { type: 'text', required: true },
          likes: { type: 'integer', default: 0 },
        },
        { timestamps: true },
      );
    }

    // ── Noise Likes ────────────────────────────────────────────────────────
    if (!exists('noise_likes')) {
      await this.ductape.createCollection('noise_likes', {
        id: { type: 'uuid', primaryKey: true },
        postId: { type: 'uuid', required: true },
        userId: { type: 'uuid', required: true },
        createdAt: { type: 'datetime' },
      });
    }

    // ── Reply Likes ────────────────────────────────────────────────────────
    if (!exists('reply_likes')) {
      await this.ductape.createCollection('reply_likes', {
        id: { type: 'uuid', primaryKey: true },
        replyId: { type: 'uuid', required: true },
        userId: { type: 'uuid', required: true },
        createdAt: { type: 'datetime' },
      });
    }

    // ── Notifications ──────────────────────────────────────────────────────
    if (!exists('notifications')) {
      await this.ductape.createCollection(
        'notifications',
        {
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
              'match_update',
            ],
          },
          title: { type: 'string', required: true },
          message: { type: 'text', required: true },
          isRead: { type: 'boolean', default: false },
          data: { type: 'json' },
        },
        { timestamps: true },
      );
    }

    // ── Spotchecks (Match Verification) ───────────────────────────────────
    if (!exists('spotchecks')) {
      await this.ductape.createCollection(
        'spotchecks',
        {
          id: { type: 'uuid', primaryKey: true },
          matchId: { type: 'uuid', required: true },
          evidence: { type: 'json', default: [] },
          player1Claim: { type: 'json' },
          player2Claim: { type: 'json' },
          status: { type: 'string', enum: ['pending', 'reviewing', 'resolved'] },
          assignedTo: { type: 'uuid' },
          resolution: { type: 'json' },
          resolvedBy: { type: 'uuid' },
          resolvedAt: { type: 'datetime' },
        },
        { timestamps: true },
      );
    }

    // ── User Stats (per guild) ─────────────────────────────────────────────
    // Field names aligned with UsersService: winStreak, highestWinStreak,
    // totalCreditsWon, totalCreditsLost
    if (!exists('user_stats')) {
      await this.ductape.createCollection(
        'user_stats',
        {
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
        },
        { timestamps: true },
      );
    }

    // ── Achievements ───────────────────────────────────────────────────────
    if (!exists('achievements')) {
      await this.ductape.createCollection('achievements', {
        id: { type: 'uuid', primaryKey: true },
        name: { type: 'string', required: true },
        description: { type: 'text' },
        icon: { type: 'string' },
        requirement: { type: 'json' },
        xpReward: { type: 'integer', default: 0 },
        creditReward: { type: 'json' },
      });
    }

    // ── User Achievements ──────────────────────────────────────────────────
    if (!exists('user_achievements')) {
      await this.ductape.createCollection('user_achievements', {
        id: { type: 'uuid', primaryKey: true },
        userId: { type: 'uuid', required: true },
        achievementId: { type: 'uuid', required: true },
        unlockedAt: { type: 'datetime' },
      });
    }

    // ── Activities (User Activity Feed) ───────────────────────────────────
    if (!exists('activities')) {
      await this.ductape.createCollection(
        'activities',
        {
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
        },
        { timestamps: true },
      );
    }

    this.logger.log('All collections ensured');
  }

  private async setupIndexes() {
    // Users indexes
    await this.ductape.createIndex('users', ['username'], { unique: true });
    await this.ductape.createIndex('users', ['email'], { unique: true });
    await this.ductape.createIndex('users', ['isOnline']);

    // Guilds indexes
    await this.ductape.createIndex('guilds', ['slug'], { unique: true });

    // User-Guild indexes
    await this.ductape.createIndex('user_guilds', ['userId']);
    await this.ductape.createIndex('user_guilds', ['guildId']);

    // Pulls indexes
    await this.ductape.createIndex('pulls', ['status']);
    await this.ductape.createIndex('pulls', ['guildId']);
    await this.ductape.createIndex('pulls', ['initiatorId']);

    // Calls indexes
    await this.ductape.createIndex('calls', ['challengerId']);
    await this.ductape.createIndex('calls', ['challengedId']);
    await this.ductape.createIndex('calls', ['status']);

    // Matches indexes
    await this.ductape.createIndex('matches', ['player1Id']);
    await this.ductape.createIndex('matches', ['player2Id']);
    await this.ductape.createIndex('matches', ['status']);
    await this.ductape.createIndex('matches', ['guildId']);

    // Runs indexes
    await this.ductape.createIndex('runs', ['guildId']);
    await this.ductape.createIndex('runs', ['isActive']);

    // Leagues indexes
    await this.ductape.createIndex('leagues', ['guildId']);
    await this.ductape.createIndex('leagues', ['status']);

    // Crews indexes
    await this.ductape.createIndex('crews', ['tag'], { unique: true });
    await this.ductape.createIndex('crews', ['leaderId']);

    // Crew Members indexes
    await this.ductape.createIndex('crew_members', ['crewId']);
    await this.ductape.createIndex('crew_members', ['userId']);

    // Noise Posts indexes
    await this.ductape.createIndex('noise_posts', ['authorId']);
    await this.ductape.createIndex('noise_posts', ['guildId']);

    // Notifications indexes
    await this.ductape.createIndex('notifications', ['userId']);
    await this.ductape.createIndex('notifications', ['userId']);

    // User Stats indexes
    await this.ductape.createIndex('user_stats', ['userId']);
    await this.ductape.createIndex('user_stats', ['guildId']);

    // Activities indexes
    await this.ductape.createIndex('activities', ['userId']);

    // Live Matches indexes
    await this.ductape.createIndex('live_matches', ['matchId'], { unique: true });
    await this.ductape.createIndex('live_matches', ['isLive']);

    this.logger.log('All indexes ensured');
  }
}
