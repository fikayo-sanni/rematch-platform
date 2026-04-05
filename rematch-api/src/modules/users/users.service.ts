import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { DuctapeService } from '../../config/ductape.config';
import { GraphSetupService } from '../../database/graph-setup.service';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  UpdateCreditsDto,
  RankEntryDto,
  UpdatePasswordDto,
} from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly ductape: DuctapeService,
    private readonly graphService: GraphSetupService,
  ) {}

  // ==================== AUTH ====================

  async register(dto: CreateUserDto) {
    // Check if email exists
    const existingEmail = await this.ductape.dbFindOne('users', {
      email: dto.email,
    });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if username exists
    const existingUsername = await this.ductape.dbFindOne('users', {
      username: dto.username,
    });
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const userId = uuidv4();
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
      credits: { rc: 500, bc: 50 }, // Starting credits
      isOnline: true,
      createdAt: new Date(),
    };

    await this.ductape.dbInsert('users', user);

    // Create user node in graph
    await this.graphService.createUserNode(
      userId,
      user.username,
      user.level,
      user.reputation,
      true,
    );

    // Create initial stats record (global)
    await this.ductape.dbInsert('user_stats', {
      id: uuidv4(),
      userId,
      guildId: 'global',
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      highestWinStreak: 0,
      totalCreditsWon: 0,
      totalCreditsLost: 0,
    });

    // Create session using Ductape Sessions API
    const session = await this.ductape.createSession(userId, {
      username: user.username,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: session.token,
      refreshToken: session.refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.ductape.dbFindOne('users', { email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = this.hashPassword(dto.password);
    if ((user as any).password !== hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update online status
    await this.ductape.dbUpdate(
      'users',
      { id: (user as any).id },
      { $set: { isOnline: true } },
    );

    // Update graph node
    await this.graphService.createUserNode(
      (user as any).id,
      (user as any).username,
      (user as any).level,
      (user as any).reputation,
      true,
    );

    // Create session using Ductape Sessions API
    const session = await this.ductape.createSession((user as any).id, {
      username: (user as any).username,
      email: (user as any).email,
    });

    const { password: _, ...userWithoutPassword } = user as any;
    return {
      user: userWithoutPassword,
      token: session.token,
      refreshToken: session.refreshToken,
    };
  }

  async logout(userId: string, token: string) {
    // Revoke session via Ductape Sessions API
    try {
      await this.ductape.revokeSession({ identifier: userId });
    } catch (error) {
      this.logger.warn(`Failed to revoke session for user ${userId}`, error);
    }

    // Set user offline
    await this.ductape.dbUpdate(
      'users',
      { id: userId },
      { $set: { isOnline: false, lastSeen: new Date() } },
    );

    return { success: true };
  }

  async refreshToken(refreshToken: string) {
    const session = await this.ductape.refreshSession(refreshToken);
    return session;
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = (await this.ductape.dbFindOne('users', { id: userId })) as any;
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const hashedOld = this.hashPassword(dto.oldPassword);
    if (user.password !== hashedOld) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedNew = this.hashPassword(dto.newPassword);
    await this.ductape.dbUpdate(
      'users',
      { id: userId },
      { $set: { password: hashedNew } },
    );

    return { success: true };
  }

  async getMe(userId: string) {
    return this.findById(userId);
  }

  // ==================== USER CRUD ====================

  async findById(id: string) {
    const cacheKey = `user:id:${id}`;
    const cached = await this.ductape.cacheGet(cacheKey);
    if (cached) return cached as any;

    const user = await this.ductape.dbFindOne('users', { id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password: _, ...userWithoutPassword } = user as any;
    
    await this.ductape.cacheSet(cacheKey, userWithoutPassword, 30); // 30s TTL
    return userWithoutPassword;
  }

  async findByUsername(username: string) {
    const cacheKey = `user:username:${username}`;
    const cached = await this.ductape.cacheGet(cacheKey);
    if (cached) return cached as any;

    const user = await this.ductape.dbFindOne('users', { username });
    if (!user) {
      throw new NotFoundException(`User @${username} not found`);
    }
    const { password: _, ...userWithoutPassword } = user as any;

    await this.ductape.cacheSet(cacheKey, userWithoutPassword, 30); // 30s TTL
    return userWithoutPassword;
  }


  async findAll(
    options: { limit?: number; skip?: number; isOnline?: boolean } = {},
  ) {
    const query: Record<string, unknown> = {};
    if (options.isOnline !== undefined) {
      query.isOnline = options.isOnline;
    }

    const users = await this.ductape.dbFindMany('users', query, {
      limit: options.limit || 50,
      skip: options.skip || 0,
      sort: { level: -1 },
    });

    return (users as any[]).map(({ password: _, ...user }) => user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);

    if (dto.username && dto.username !== user.username) {
      const existing = await this.ductape.dbFindOne('users', {
        username: dto.username,
      });
      if (existing) {
        throw new ConflictException('Username already taken');
      }
    }

    await this.ductape.dbUpdate('users', { id }, { $set: dto });

    // Invalidate cache
    await this.ductape.cacheDelete(`user:id:${id}`);
    const u = (await this.ductape.dbFindOne('users', { id })) as any;
    if (u?.username) await this.ductape.cacheDelete(`user:username:${u.username}`);

    if (dto.username) {
      await this.graphService.createUserNode(
        id,
        dto.username,
        u.level,
        u.reputation,
        u.isOnline,
      );
    }

    return this.findById(id);
  }


  async getAvatarUploadUrl(userId: string, fileName: string, fileType: string) {
    const objectKey = `avatars/${userId}-${Date.now()}-${fileName}`;
    const uploadUrl = await this.ductape.getSignedUrl(objectKey, 3600, 'write');
    
    // The public URL will be what we store in the DB
    // Assuming Ductape storage returns a direct URL or we can construct it
    const publicUrl = `https://storage.ductape.app/${this.ductape.productTag}/${objectKey}`;

    return { uploadUrl, publicUrl };
  }

  async updateAvatar(userId: string, url: string) {
    await this.ductape.dbUpdate(
      'users',
      { id: userId },
      { $set: { avatar: url } },
    );

    return this.findById(userId);
  }

  // ==================== CREDITS ====================

  async updateCredits(userId: string, dto: UpdateCreditsDto) {
    const user = await this.findById(userId);
    const creditField = `credits.${dto.type}`;

    const currentCredits = user.credits?.[dto.type] ?? 0;
    let newAmount: number;

    if (dto.operation === 'add') {
      newAmount = currentCredits + dto.amount;
    } else {
      if (currentCredits < dto.amount) {
        throw new ConflictException('Insufficient credits');
      }
      newAmount = currentCredits - dto.amount;
    }

    await this.ductape.dbUpdate(
      'users',
      { id: userId },
      {
        $set: { [creditField]: newAmount },
      },
    );

    return this.findById(userId);
  }

  async addXP(userId: string, amount: number) {
    const user = await this.findById(userId);
    const newXP = user.xp + amount;
    const newLevel = this.calculateLevel(newXP);

    await this.ductape.dbUpdate(
      'users',
      { id: userId },
      {
        $set: { xp: newXP, level: newLevel },
      },
    );

    if (newLevel > user.level) {
      this.logger.log(`User ${userId} leveled up to level ${newLevel}`);
    }

    return this.findById(userId);
  }

  private calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  // ==================== RANKINGS ====================

  async getRankboard(
    guildId: string,
    options: { limit?: number; skip?: number } = {},
  ) {
    const cacheKey = `rankboard:${guildId}:${options.limit || 50}:${options.skip || 0}`;
    const cached = await this.ductape.cacheGet(cacheKey);
    if (cached) return cached as RankEntryDto[];

    const stats = await this.ductape.dbFindMany(
      'user_stats',
      { guildId },
      {
        limit: options.limit || 50,
        skip: options.skip || 0,
        sort: { wins: -1, totalCreditsWon: -1 },
      },
    );

    const rankEntries = await Promise.all(
      (stats as any[]).map(async (stat, index) => {
        try {
          const user = await this.findById(stat.userId);
          const entry: RankEntryDto = {
            rank: (options.skip || 0) + index + 1,
            user: user as any,
            wins: stat.wins,
            losses: stat.losses,
            creditsEarned: stat.totalCreditsWon,
            winStreak: stat.winStreak,
            change: 0,
          };
          return entry;
        } catch {
          return null;
        }
      }),
    );

    const result = rankEntries.filter((entry): entry is RankEntryDto => entry !== null);
    await this.ductape.cacheSet(cacheKey, result, 60); // 60s TTL
    return result;
  }

  async getUserRank(userId: string, guildId: string) {
    const allStats = await this.ductape.dbFindMany(
      'user_stats',
      { guildId },
      { sort: { wins: -1, totalCreditsWon: -1 } },
    );

    const rank =
      (allStats as any[]).findIndex((s) => s.userId === userId) + 1;
    const userStats = (allStats as any[]).find((s) => s.userId === userId);

    if (!userStats) {
      return null;
    }

    const user = await this.findById(userId);
    return {
      rank,
      user,
      wins: userStats.wins,
      losses: userStats.losses,
      creditsEarned: userStats.totalCreditsWon,
      winStreak: userStats.winStreak,
      change: 0,
    };
  }

  // ==================== STATS ====================

  async getUserStats(userId: string, guildId?: string) {
    const query: Record<string, unknown> = { userId };
    if (guildId) {
      query.guildId = guildId;
    }

    const stats = await this.ductape.dbFindMany('user_stats', query);

    if ((stats as any[]).length === 0) {
      return {
        userId,
        totalMatches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        winStreak: 0,
        highestWinStreak: 0,
        totalCreditsWon: 0,
        totalCreditsLost: 0,
      };
    }

    // Aggregate stats across all guilds if no specific guild
    const aggregated = (stats as any[]).reduce(
      (acc, stat) => ({
        wins: acc.wins + (stat.wins || 0),
        losses: acc.losses + (stat.losses || 0),
        draws: acc.draws + (stat.draws || 0),
        winStreak: Math.max(acc.winStreak, stat.winStreak || 0),
        highestWinStreak: Math.max(
          acc.highestWinStreak,
          stat.highestWinStreak || 0,
        ),
        totalCreditsWon: acc.totalCreditsWon + (stat.totalCreditsWon || 0),
        totalCreditsLost: acc.totalCreditsLost + (stat.totalCreditsLost || 0),
      }),
      {
        wins: 0,
        losses: 0,
        draws: 0,
        winStreak: 0,
        highestWinStreak: 0,
        totalCreditsWon: 0,
        totalCreditsLost: 0,
      },
    );

    const totalMatches = aggregated.wins + aggregated.losses + aggregated.draws;

    return {
      userId,
      totalMatches,
      ...aggregated,
      winRate:
        totalMatches > 0
          ? Math.round((aggregated.wins / totalMatches) * 1000) / 10
          : 0,
    };
  }

  // ==================== ACHIEVEMENTS ====================

  async getAchievements() {
    return this.ductape.dbFindMany('achievements', {});
  }

  async getUserAchievements(userId: string) {
    const userAchievements = await this.ductape.dbFindMany('user_achievements', {
      userId,
    });

    return Promise.all(
      (userAchievements as any[]).map(async (ua) => {
        const achievement = await this.ductape.dbFindOne('achievements', {
          id: ua.achievementId,
        });
        return {
          ...ua,
          achievement,
        };
      }),
    );
  }

  async getPreviousRank(userId: string, guildId: string) {
    // Rank history not yet implemented, return stub
    return 0;
  }


  async updateUserStats(
    userId: string,
    guildId: string,
    updates: {
      won?: boolean;
      creditsWon?: number;
      creditsLost?: number;
    },
  ) {
    const existingStats = await this.ductape.dbFindOne('user_stats', {
      userId,
      guildId,
    });

    if (!existingStats) {
      await this.ductape.dbInsert('user_stats', {
        id: uuidv4(),
        userId,
        guildId,
        wins: updates.won ? 1 : 0,
        losses: updates.won === false ? 1 : 0,
        draws: 0,
        winStreak: updates.won ? 1 : 0,
        highestWinStreak: updates.won ? 1 : 0,
        totalCreditsWon: updates.creditsWon || 0,
        totalCreditsLost: updates.creditsLost || 0,
      });
    } else {
      const stat = existingStats as any;
      const updateData: Record<string, unknown> = {};

      if (updates.won !== undefined) {
        if (updates.won) {
          const newStreak = (stat.winStreak || 0) + 1;
          updateData.wins = (stat.wins || 0) + 1;
          updateData.winStreak = newStreak;
          updateData.highestWinStreak = Math.max(
            stat.highestWinStreak || 0,
            newStreak,
          );
        } else {
          updateData.losses = (stat.losses || 0) + 1;
          updateData.winStreak = 0;
        }
      }

      if (updates.creditsWon) {
        updateData.totalCreditsWon =
          (stat.totalCreditsWon || 0) + updates.creditsWon;
      }

      if (updates.creditsLost) {
        updateData.totalCreditsLost =
          (stat.totalCreditsLost || 0) + updates.creditsLost;
      }

      if (Object.keys(updateData).length > 0) {
        await this.ductape.dbUpdate(
          'user_stats',
          { userId, guildId },
          { $set: updateData },
        );
      }
    }

    return this.getUserStats(userId, guildId);
  }

  // ==================== ONLINE USERS ====================

  async getOnlineUsers(limit: number = 20) {
    return this.findAll({ limit, isOnline: true });
  }

  async setOnlineStatus(userId: string, isOnline: boolean) {
    await this.ductape.dbUpdate(
      'users',
      { id: userId },
      {
        $set: {
          isOnline,
          ...(isOnline ? {} : { lastSeen: new Date() }),
        },
      },
    );

    const user = await this.findById(userId);
    await this.graphService.createUserNode(
      userId,
      user.username,
      user.level,
      user.reputation,
      isOnline,
    );

    return user;
  }

  async updatePushToken(userId: string, token: string) {
    await this.ductape.dbUpdate(
      'users',
      { id: userId },
      { $set: { pushToken: token } },
    );
    return { success: true };
  }

  // ==================== HELPERS ====================

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}
