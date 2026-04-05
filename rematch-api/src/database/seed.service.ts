import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DuctapeService } from '../config/ductape.config';
import { GraphSetupService } from './graph-setup.service';

// Helper to generate avatar URLs using DiceBear API
const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
const initials = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly ductape: DuctapeService,
    private readonly graphService: GraphSetupService,
  ) {}

  async onModuleInit() {
    // Only seed if database is empty
    const existingUsers = await this.ductape.dbFindMany(
      'users',
      {},
      { limit: 1 },
    );
    if (existingUsers.length > 0) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding database with dummy data...');
    await this.seed();
    this.logger.log('Database seeding complete!');
  }

  async seed() {
    // Seed in order of dependencies
    await this.seedUsers();
    await this.seedEditions();
    await this.seedGuilds();
    await this.seedUserGuilds();
    await this.seedPulls();
    await this.seedCalls();
    await this.seedMatches();
    await this.seedRuns();
    await this.seedLeagues();
    await this.seedCrews();
    await this.seedNoisePosts();
    await this.seedNotifications();
    await this.seedSpotchecks();
    await this.seedRankboard();
    await this.seedActivities();
  }

  private async seedUsers() {
    const users = [
      {
        id: 'user-001',
        username: 'ShadowStrike',
        email: 'shadow@rematch.gg',
        avatar: avatar('ShadowStrike'),
        bio: 'Competitive FIFA player. Come catch these hands.',
        reputation: 4.8,
        xp: 12500,
        level: 24,
        credits: { rc: 2450, bc: 150 },
        isOnline: true,
        passwordHash: '$2b$10$placeholder', // In production, this would be properly hashed
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
      },
      {
        id: 'user-002',
        username: 'NightHawk',
        email: 'hawk@rematch.gg',
        avatar: avatar('NightHawk'),
        reputation: 4.6,
        xp: 9800,
        level: 19,
        credits: { rc: 1800, bc: 50 },
        isOnline: true,
        passwordHash: '$2b$10$placeholder',
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date(),
      },
      {
        id: 'user-003',
        username: 'ViperQueen',
        email: 'viper@rematch.gg',
        avatar: avatar('ViperQueen'),
        reputation: 4.9,
        xp: 18200,
        level: 32,
        credits: { rc: 5200, bc: 300 },
        isOnline: false,
        passwordHash: '$2b$10$placeholder',
        createdAt: new Date('2023-11-10'),
        updatedAt: new Date(),
      },
      {
        id: 'user-004',
        username: 'BlitzKrieg',
        email: 'blitz@rematch.gg',
        avatar: avatar('BlitzKrieg'),
        reputation: 4.3,
        xp: 7500,
        level: 15,
        credits: { rc: 900, bc: 25 },
        isOnline: true,
        passwordHash: '$2b$10$placeholder',
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date(),
      },
      {
        id: 'user-005',
        username: 'PhantomX',
        email: 'phantom@rematch.gg',
        avatar: avatar('PhantomX'),
        reputation: 4.7,
        xp: 14300,
        level: 27,
        credits: { rc: 3100, bc: 200 },
        isOnline: true,
        passwordHash: '$2b$10$placeholder',
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date(),
      },
    ];

    for (const user of users) {
      await this.ductape.dbInsert('users', user);
      await this.graphService.createUserNode(
        user.id,
        user.username,
        user.level,
      );
    }

    // Seed user stats
    const userStats = [
      {
        userId: 'user-001',
        guildId: 'guild-fc',
        wins: 142,
        losses: 38,
        draws: 12,
        winStreak: 3,
        highestWinStreak: 8,
        totalCreditsWon: 32100,
        totalCreditsLost: 18500,
      },
      {
        userId: 'user-002',
        guildId: 'guild-fc',
        wins: 128,
        losses: 42,
        draws: 8,
        winStreak: 0,
        highestWinStreak: 6,
        totalCreditsWon: 28700,
        totalCreditsLost: 15200,
      },
      {
        userId: 'user-003',
        guildId: 'guild-fc',
        wins: 187,
        losses: 23,
        draws: 15,
        winStreak: 12,
        highestWinStreak: 15,
        totalCreditsWon: 45200,
        totalCreditsLost: 8900,
      },
      {
        userId: 'user-004',
        guildId: 'guild-fc',
        wins: 98,
        losses: 52,
        draws: 5,
        winStreak: 2,
        highestWinStreak: 4,
        totalCreditsWon: 21300,
        totalCreditsLost: 12100,
      },
      {
        userId: 'user-005',
        guildId: 'guild-fc',
        wins: 156,
        losses: 31,
        draws: 10,
        winStreak: 5,
        highestWinStreak: 9,
        totalCreditsWon: 38500,
        totalCreditsLost: 11200,
      },
    ];

    for (const stats of userStats) {
      await this.ductape.dbInsert('user_stats', {
        id: `stats-${stats.userId}-${stats.guildId}`,
        ...stats,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    this.logger.log('Users seeded');
  }

  private async seedEditions() {
    const editions = [
      // FC Editions
      {
        id: 'fc25',
        guildId: 'guild-fc',
        name: 'EA FC 25',
        year: '2025',
        isDefault: true,
        createdAt: new Date(),
      },
      {
        id: 'fc24',
        guildId: 'guild-fc',
        name: 'EA FC 24',
        year: '2024',
        isDefault: false,
        createdAt: new Date(),
      },
      // COD Editions
      {
        id: 'bo6',
        guildId: 'guild-cod',
        name: 'Black Ops 6',
        year: '2024',
        isDefault: true,
        createdAt: new Date(),
      },
      {
        id: 'mw3',
        guildId: 'guild-cod',
        name: 'Modern Warfare III',
        year: '2023',
        isDefault: false,
        createdAt: new Date(),
      },
      // NBA 2K Editions
      {
        id: '2k25',
        guildId: 'guild-2k',
        name: 'NBA 2K25',
        year: '2025',
        isDefault: true,
        createdAt: new Date(),
      },
      {
        id: '2k24',
        guildId: 'guild-2k',
        name: 'NBA 2K24',
        year: '2024',
        isDefault: false,
        createdAt: new Date(),
      },
      // Madden Edition
      {
        id: 'madden25',
        guildId: 'guild-madden',
        name: 'Madden 25',
        year: '2024',
        isDefault: true,
        createdAt: new Date(),
      },
    ];

    for (const edition of editions) {
      await this.ductape.dbInsert('editions', edition);
    }

    this.logger.log('Editions seeded');
  }

  private async seedGuilds() {
    const guilds = [
      {
        id: 'guild-fc',
        name: 'EA FC',
        slug: 'ea-fc',
        logo: initials('EA FC'),
        banner:
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=400&fit=crop',
        description:
          'The ultimate football gaming community. Prove your skills on the virtual pitch.',
        memberCount: 24500,
        activeNow: 892,
        accentColor: '#00FF87',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'guild-cod',
        name: 'Call of Duty',
        slug: 'call-of-duty',
        logo: initials('COD'),
        banner:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop',
        description: 'Lock and load. Competitive CoD matches and tournaments.',
        memberCount: 18200,
        activeNow: 654,
        accentColor: '#FF6B00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'guild-2k',
        name: 'NBA 2K',
        slug: 'nba-2k',
        logo: initials('2K'),
        banner:
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=400&fit=crop',
        description: 'Ball is life. Show em what you got on the court.',
        memberCount: 15800,
        activeNow: 423,
        accentColor: '#FF1744',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'guild-madden',
        name: 'Madden NFL',
        slug: 'madden',
        logo: initials('NFL'),
        banner:
          'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&h=400&fit=crop',
        description:
          'Gridiron glory awaits. Dominate the virtual football field.',
        memberCount: 12400,
        activeNow: 287,
        accentColor: '#1E88E5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const guild of guilds) {
      await this.ductape.dbInsert('guilds', guild);
      await this.graphService.createGuildNode(guild.id, guild.name, guild.slug);
    }

    this.logger.log('Guilds seeded');
  }

  private async seedUserGuilds() {
    const userGuilds = [
      // ShadowStrike joined FC and COD
      {
        id: 'ug-001',
        userId: 'user-001',
        guildId: 'guild-fc',
        joinedAt: new Date('2024-01-15'),
      },
      {
        id: 'ug-002',
        userId: 'user-001',
        guildId: 'guild-cod',
        joinedAt: new Date('2024-02-01'),
      },
      // NightHawk joined FC and COD
      {
        id: 'ug-003',
        userId: 'user-002',
        guildId: 'guild-fc',
        joinedAt: new Date('2024-02-20'),
      },
      {
        id: 'ug-004',
        userId: 'user-002',
        guildId: 'guild-cod',
        joinedAt: new Date('2024-03-01'),
      },
      // ViperQueen joined FC
      {
        id: 'ug-005',
        userId: 'user-003',
        guildId: 'guild-fc',
        joinedAt: new Date('2023-11-10'),
      },
      // BlitzKrieg joined FC
      {
        id: 'ug-006',
        userId: 'user-004',
        guildId: 'guild-fc',
        joinedAt: new Date('2024-03-05'),
      },
      // PhantomX joined FC and COD
      {
        id: 'ug-007',
        userId: 'user-005',
        guildId: 'guild-fc',
        joinedAt: new Date('2023-12-01'),
      },
      {
        id: 'ug-008',
        userId: 'user-005',
        guildId: 'guild-cod',
        joinedAt: new Date('2024-01-15'),
      },
    ];

    for (const ug of userGuilds) {
      await this.ductape.dbInsert('user_guilds', ug);
      await this.graphService.userJoinsGuild(ug.userId, ug.guildId);
    }

    this.logger.log('User guilds seeded');
  }

  private async seedPulls() {
    const now = Date.now();
    const pulls = [
      {
        id: 'pull-001',
        guildId: 'guild-fc',
        editionId: 'fc25',
        creatorId: 'user-001',
        opponentId: 'user-002',
        creditPot: 50,
        status: 'pending',
        expiresAt: new Date(now + 1000 * 60 * 2),
        createdAt: new Date(),
      },
      {
        id: 'pull-002',
        guildId: 'guild-cod',
        editionId: 'bo6',
        creatorId: 'user-001',
        opponentId: 'user-005',
        creditPot: 100,
        status: 'pending',
        expiresAt: new Date(now + 1000 * 60 * 5),
        createdAt: new Date(),
      },
    ];

    for (const pull of pulls) {
      await this.ductape.dbInsert('pulls', pull);
    }

    this.logger.log('Pulls seeded');
  }

  private async seedCalls() {
    const now = Date.now();
    const calls = [
      {
        id: 'call-001',
        guildId: 'guild-fc',
        editionId: 'fc25',
        challengerId: 'user-004',
        challengedId: 'user-001',
        creditPot: 75,
        message: "Let's run it! I've been practicing all week.",
        status: 'pending',
        createdAt: new Date(now - 1000 * 60 * 10),
        expiresAt: new Date(now + 1000 * 60 * 50),
      },
      {
        id: 'call-002',
        guildId: 'guild-fc',
        editionId: 'fc25',
        challengerId: 'user-001',
        challengedId: 'user-003',
        creditPot: 150,
        message: 'Time to dethrone the queen!',
        status: 'pending',
        createdAt: new Date(now - 1000 * 60 * 30),
        expiresAt: new Date(now + 1000 * 60 * 30),
      },
    ];

    for (const call of calls) {
      await this.ductape.dbInsert('calls', call);
    }

    this.logger.log('Calls seeded');
  }

  private async seedMatches() {
    const now = Date.now();
    const matches = [
      {
        id: 'match-001',
        type: 'pull',
        status: 'completed',
        guildId: 'guild-fc',
        editionId: 'fc25',
        player1Id: 'user-001',
        player2Id: 'user-004',
        creditPot: 50,
        result: {
          winnerId: 'user-001',
          player1Score: 3,
          player2Score: 1,
        },
        createdAt: new Date(now - 1000 * 60 * 60 * 2),
        completedAt: new Date(now - 1000 * 60 * 60),
      },
      {
        id: 'match-002',
        type: 'call',
        status: 'completed',
        guildId: 'guild-fc',
        editionId: 'fc25',
        player1Id: 'user-001',
        player2Id: 'user-003',
        creditPot: 100,
        result: {
          winnerId: 'user-003',
          player1Score: 2,
          player2Score: 4,
        },
        createdAt: new Date(now - 1000 * 60 * 60 * 24),
        completedAt: new Date(now - 1000 * 60 * 60 * 23),
      },
      {
        id: 'match-003',
        type: 'pull',
        status: 'in_progress',
        guildId: 'guild-fc',
        editionId: 'fc25',
        player1Id: 'user-002',
        player2Id: 'user-005',
        creditPot: 75,
        createdAt: new Date(now - 1000 * 60 * 15),
        startedAt: new Date(now - 1000 * 60 * 10),
      },
      {
        id: 'match-004',
        type: 'call',
        status: 'accepted',
        guildId: 'guild-fc',
        editionId: 'fc25',
        player1Id: 'user-001',
        player2Id: 'user-002',
        creditPot: 150,
        context: { type: 'challenge', name: 'Direct Challenge' },
        createdAt: new Date(now - 1000 * 60 * 30),
        scheduledAt: new Date(now + 1000 * 60 * 45),
      },
      {
        id: 'match-005',
        type: 'pull',
        status: 'accepted',
        guildId: 'guild-fc',
        editionId: 'fc25',
        player1Id: 'user-003',
        player2Id: 'user-001',
        creditPot: 200,
        context: { type: 'league', name: 'Weekend Warriors League' },
        createdAt: new Date(now - 1000 * 60 * 60 * 2),
        scheduledAt: new Date(now + 1000 * 60 * 60 * 3),
      },
      {
        id: 'match-006',
        type: 'call',
        status: 'accepted',
        guildId: 'guild-cod',
        editionId: 'bo6',
        player1Id: 'user-001',
        player2Id: 'user-005',
        creditPot: 100,
        context: { type: 'tournament', name: 'CoD Weekly Cup' },
        createdAt: new Date(now - 1000 * 60 * 60 * 5),
        scheduledAt: new Date(now + 1000 * 60 * 60 * 24),
      },
    ];

    for (const match of matches) {
      await this.ductape.dbInsert('matches', match);
      if (match.status === 'completed' && match.result) {
        await this.graphService.recordMatch(
          match.id,
          match.player1Id,
          match.player2Id,
          match.result.winnerId,
          match.guildId,
        );
      }
    }

    this.logger.log('Matches seeded');
  }

  private async seedRuns() {
    const now = Date.now();
    const runs = [
      {
        id: 'run-001',
        name: 'Daily Grind',
        type: 'daily',
        guildId: 'guild-fc',
        editionId: 'fc25',
        creditPot: 5000,
        participantCount: 128,
        participants: [
          'user-001',
          'user-002',
          'user-003',
          'user-004',
          'user-005',
        ],
        status: 'active',
        startsAt: new Date(),
        endsAt: new Date(now + 1000 * 60 * 60 * 8),
        createdAt: new Date(),
      },
      {
        id: 'run-002',
        name: 'Weekend Warfare',
        type: 'weekend',
        guildId: 'guild-fc',
        editionId: 'fc25',
        creditPot: 25000,
        participantCount: 512,
        maxParticipants: 1024,
        participants: [],
        status: 'upcoming',
        startsAt: new Date(now + 1000 * 60 * 60 * 24),
        endsAt: new Date(now + 1000 * 60 * 60 * 72),
        createdAt: new Date(),
      },
      {
        id: 'run-003',
        name: 'Ranked Season',
        type: 'rank_push',
        guildId: 'guild-fc',
        editionId: 'fc25',
        creditPot: 100000,
        participantCount: 2048,
        participants: ['user-001', 'user-003', 'user-005'],
        status: 'active',
        startsAt: new Date(),
        endsAt: new Date(now + 1000 * 60 * 60 * 24 * 7),
        createdAt: new Date(),
      },
    ];

    for (const run of runs) {
      await this.ductape.dbInsert('runs', run);
    }

    this.logger.log('Runs seeded');
  }

  private async seedLeagues() {
    const now = Date.now();
    const leagues = [
      {
        id: 'league-001',
        name: 'Ultimate Champions League',
        description:
          'Weekly league for top players. 10 matches, best record wins.',
        guildId: 'guild-fc',
        editionId: 'fc25',
        creatorId: 'user-003',
        type: 'round_robin',
        entryFee: 100,
        prizePool: 2500,
        maxParticipants: 16,
        participants: [
          'user-001',
          'user-002',
          'user-003',
          'user-004',
          'user-005',
        ],
        participantCount: 12,
        matchesPerPlayer: 10,
        status: 'active',
        standings: [
          {
            userId: 'user-003',
            played: 5,
            wins: 4,
            draws: 1,
            losses: 0,
            points: 13,
            goalsFor: 12,
            goalsAgainst: 3,
          },
          {
            userId: 'user-001',
            played: 5,
            wins: 3,
            draws: 1,
            losses: 1,
            points: 10,
            goalsFor: 9,
            goalsAgainst: 5,
          },
          {
            userId: 'user-005',
            played: 4,
            wins: 3,
            draws: 0,
            losses: 1,
            points: 9,
            goalsFor: 8,
            goalsAgainst: 4,
          },
          {
            userId: 'user-002',
            played: 5,
            wins: 2,
            draws: 1,
            losses: 2,
            points: 7,
            goalsFor: 7,
            goalsAgainst: 8,
          },
          {
            userId: 'user-004',
            played: 4,
            wins: 1,
            draws: 0,
            losses: 3,
            points: 3,
            goalsFor: 4,
            goalsAgainst: 10,
          },
        ],
        startsAt: new Date(),
        endsAt: new Date(now + 1000 * 60 * 60 * 24 * 7),
        createdAt: new Date(),
      },
      {
        id: 'league-002',
        name: 'Casual Friday League',
        description: 'Relaxed weekly league for fun. Low stakes, big vibes.',
        guildId: 'guild-fc',
        editionId: 'fc25',
        creatorId: 'user-002',
        type: 'round_robin',
        entryFee: 25,
        prizePool: 500,
        maxParticipants: 8,
        participants: ['user-001', 'user-002'],
        participantCount: 6,
        matchesPerPlayer: 7,
        status: 'upcoming',
        standings: [],
        startsAt: new Date(now + 1000 * 60 * 60 * 24 * 2),
        endsAt: new Date(now + 1000 * 60 * 60 * 24 * 9),
        createdAt: new Date(),
      },
      {
        id: 'league-003',
        name: 'Pro Invitational',
        description:
          'Invite-only league for verified pros. High stakes matches.',
        guildId: 'guild-fc',
        editionId: 'fc25',
        creatorId: 'user-003',
        type: 'round_robin',
        entryFee: 500,
        prizePool: 10000,
        maxParticipants: 12,
        participants: ['user-003', 'user-005'],
        participantCount: 10,
        matchesPerPlayer: 11,
        status: 'completed',
        winnerId: 'user-003',
        standings: [
          {
            userId: 'user-003',
            played: 11,
            wins: 9,
            draws: 1,
            losses: 1,
            points: 28,
            goalsFor: 28,
            goalsAgainst: 8,
          },
          {
            userId: 'user-005',
            played: 11,
            wins: 8,
            draws: 2,
            losses: 1,
            points: 26,
            goalsFor: 24,
            goalsAgainst: 10,
          },
        ],
        startsAt: new Date(now - 1000 * 60 * 60 * 24 * 14),
        endsAt: new Date(now - 1000 * 60 * 60 * 24 * 7),
        createdAt: new Date(),
      },
    ];

    for (const league of leagues) {
      await this.ductape.dbInsert('leagues', league);
    }

    this.logger.log('Leagues seeded');
  }

  private async seedCrews() {
    const crews = [
      {
        id: 'crew-001',
        name: 'Night Owls',
        tag: 'NITE',
        logo: initials('NO'),
        banner:
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=300&fit=crop',
        description: 'We play at night. We win at night.',
        guildId: 'guild-fc',
        leaderId: 'user-001',
        members: ['user-001', 'user-002', 'user-005'],
        memberCount: 8,
        rank: 1,
        wins: 234,
        losses: 45,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'crew-002',
        name: 'Savage Squad',
        tag: 'SVG',
        logo: initials('SS'),
        banner:
          'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=300&fit=crop',
        description: 'No mercy. Pure savagery.',
        guildId: 'guild-fc',
        leaderId: 'user-003',
        members: ['user-003', 'user-004'],
        memberCount: 6,
        rank: 2,
        wins: 198,
        losses: 52,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date(),
      },
    ];

    for (const crew of crews) {
      await this.ductape.dbInsert('crews', crew);
      await this.graphService.createCrewNode(crew.id, crew.name, crew.tag);

      // Add crew members
      for (const memberId of crew.members) {
        const role = memberId === crew.leaderId ? 'leader' : 'member';
        await this.ductape.dbInsert('crew_members', {
          id: `cm-${crew.id}-${memberId}`,
          crewId: crew.id,
          userId: memberId,
          role,
          joinedAt: new Date(),
        });
        await this.graphService.userJoinsCrew(memberId, crew.id, role);
      }
    }

    this.logger.log('Crews seeded');
  }

  private async seedNoisePosts() {
    const now = Date.now();
    const posts = [
      {
        id: 'noise-001',
        authorId: 'user-003',
        guildId: 'guild-fc',
        content: 'Just went on a 15-game win streak! Who wants smoke?',
        likes: 45,
        replies: 12,
        mentions: [],
        createdAt: new Date(now - 1000 * 60 * 15),
      },
      {
        id: 'noise-002',
        authorId: 'user-002',
        guildId: 'guild-fc',
        content: 'That last goal was INSANE! @ShadowStrike you seeing this?',
        likes: 23,
        replies: 8,
        mentions: ['ShadowStrike'],
        createdAt: new Date(now - 1000 * 60 * 45),
      },
      {
        id: 'noise-003',
        authorId: 'user-005',
        guildId: 'guild-fc',
        content:
          "Weekend tournament starting soon. Who's ready to get their credits taken?",
        likes: 67,
        replies: 24,
        mentions: [],
        createdAt: new Date(now - 1000 * 60 * 60 * 2),
      },
      {
        id: 'noise-004',
        authorId: 'user-004',
        guildId: 'guild-fc',
        content: "New meta is crazy. Y'all not ready for what I got cooking.",
        clipUrl: 'https://clips.example.com/blitz-goal',
        likes: 89,
        replies: 31,
        mentions: [],
        createdAt: new Date(now - 1000 * 60 * 60 * 5),
      },
    ];

    for (const post of posts) {
      await this.ductape.dbInsert('noise_posts', post);
    }

    // Add some likes
    const likes = [
      {
        id: 'like-001',
        postId: 'noise-002',
        userId: 'user-001',
        createdAt: new Date(),
      },
      {
        id: 'like-002',
        postId: 'noise-004',
        userId: 'user-001',
        createdAt: new Date(),
      },
    ];

    for (const like of likes) {
      await this.ductape.dbInsert('noise_likes', like);
    }

    this.logger.log('Noise posts seeded');
  }

  private async seedNotifications() {
    const now = Date.now();
    const notifications = [
      {
        id: 'notif-001',
        userId: 'user-001',
        type: 'match_found',
        title: 'Match Found!',
        message: 'NightHawk accepted your Quick Match',
        isRead: false,
        createdAt: new Date(now - 1000 * 60 * 2),
      },
      {
        id: 'notif-002',
        userId: 'user-001',
        type: 'challenge_received',
        title: 'New Challenge',
        message: 'BlitzKrieg challenged you! 75 credits on the line.',
        isRead: false,
        data: { callId: 'call-001' },
        createdAt: new Date(now - 1000 * 60 * 10),
      },
      {
        id: 'notif-003',
        userId: 'user-001',
        type: 'feed_mention',
        title: 'You were mentioned',
        message: 'NightHawk mentioned you in the Feed',
        isRead: true,
        data: { postId: 'noise-002' },
        createdAt: new Date(now - 1000 * 60 * 45),
      },
      {
        id: 'notif-004',
        userId: 'user-001',
        type: 'tournament_update',
        title: 'Tournament Starting',
        message: 'Daily Grind is now live! Join now.',
        isRead: true,
        data: { runId: 'run-001' },
        createdAt: new Date(now - 1000 * 60 * 60),
      },
      {
        id: 'notif-005',
        userId: 'user-001',
        type: 'league_update',
        title: 'League Match Scheduled',
        message: 'Your next league match vs ViperQueen is in 2 hours',
        isRead: false,
        data: { leagueId: 'league-001', opponentId: 'user-003' },
        createdAt: new Date(now - 1000 * 60 * 30),
      },
    ];

    for (const notification of notifications) {
      await this.ductape.dbInsert('notifications', notification);
    }

    this.logger.log('Notifications seeded');
  }

  private async seedSpotchecks() {
    const spotchecks = [
      {
        id: 'spot-001',
        matchId: 'match-001',
        evidence: [
          'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400',
        ],
        player1Claim: { score: 3, opponentScore: 1 },
        player2Claim: { score: 2, opponentScore: 2 },
        status: 'pending',
        assignedToId: 'user-001',
        createdAt: new Date(),
      },
    ];

    for (const spotcheck of spotchecks) {
      await this.ductape.dbInsert('spotchecks', spotcheck);
    }

    this.logger.log('Spotchecks seeded');
  }

  private async seedRankboard() {
    // Rankboard is derived from user_stats, so no separate seeding needed
    // The rankings are calculated on-the-fly from the user_stats collection
    this.logger.log('Rankboard derived from user_stats');
  }

  private async seedActivities() {
    const now = Date.now();
    const activities = [
      {
        id: 'activity-001',
        userId: 'user-003',
        type: 'match_won',
        description: 'Won against BlitzKrieg (3-1)',
        data: { matchId: 'match-001', opponentId: 'user-004', score: '3-1' },
        createdAt: new Date(now - 1000 * 60 * 60),
      },
      {
        id: 'activity-002',
        userId: 'user-003',
        type: 'rank_achieved',
        description: 'Reached #1 rank in EA FC',
        data: { guildId: 'guild-fc', rank: 1 },
        createdAt: new Date(now - 1000 * 60 * 60 * 24),
      },
      {
        id: 'activity-003',
        userId: 'user-001',
        type: 'crew_joined',
        description: 'Joined Night Owls',
        data: { crewId: 'crew-001' },
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'activity-004',
        userId: 'user-002',
        type: 'match_lost',
        description: 'Lost to ViperQueen (2-4)',
        data: { matchId: 'match-002', opponentId: 'user-003', score: '2-4' },
        createdAt: new Date(now - 1000 * 60 * 60 * 23),
      },
      {
        id: 'activity-005',
        userId: 'user-005',
        type: 'tournament_won',
        description: 'Won Weekend Warfare tournament',
        data: { runId: 'run-002', prize: 25000 },
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3),
      },
    ];

    for (const activity of activities) {
      await this.ductape.dbInsert('activities', activity);
    }

    this.logger.log('Activities seeded');
  }
}
