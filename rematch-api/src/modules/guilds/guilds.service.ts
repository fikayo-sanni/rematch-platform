import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { DuctapeService } from '../../config/ductape.config';
import { GraphSetupService } from '../../database/graph-setup.service';
import { CreateGuildDto, UpdateGuildDto, JoinGuildDto } from './dto/guild.dto';
import { SocialService } from '../social/social.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GuildsService {
  private readonly logger = new Logger(GuildsService.name);

  constructor(
    private readonly ductape: DuctapeService,
    private readonly graphService: GraphSetupService,
    private readonly socialService: SocialService,
  ) {}

  // ==================== GUILD CRUD ====================

  async create(dto: CreateGuildDto) {
    const existingSlug = (await this.ductape.dbFindOne('guilds', { slug: dto.slug })) as any;
    if (existingSlug) {
      throw new ConflictException(`Guild with slug '${dto.slug}' already exists`);
    }

    const guildId = uuidv4();
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

    // Create graph node
    await this.graphService.createGuildNode(
      guildId,
      guild.name,
      guild.slug,
      guild.accentColor,
    );

    // Invalidate cache
    await this.ductape.cacheDelete('guilds:all');

    this.logger.log(`Created guild: ${guild.name} (${guildId})`);
    return guild;
  }

  async findById(id: string) {
    const guild = await this.ductape.dbFindOne('guilds', { id });
    if (!guild) {
      throw new NotFoundException(`Guild with ID ${id} not found`);
    }
    return guild;
  }

  async findBySlug(slug: string) {
    const guild = await this.ductape.dbFindOne('guilds', { slug });
    if (!guild) {
      throw new NotFoundException(`Guild '${slug}' not found`);
    }
    return guild;
  }

  async findAll(options: { limit?: number; skip?: number } = {}) {
    const limit = options.limit || 50;
    const skip = options.skip || 0;
    const cacheKey = `guilds:all:${limit}:${skip}`;

    const cached = await this.ductape.cacheGet(cacheKey);
    if (cached) {
      return cached as any[];
    }

    const guilds = await this.ductape.dbFindMany('guilds', {}, {
      limit,
      skip,
      sort: { memberCount: -1 },
    });

    await this.ductape.cacheSet(cacheKey, guilds, 3600); // 1 hour TTL
    return guilds;
  }


  async update(id: string, dto: UpdateGuildDto) {
    await this.findById(id); // Verify exists

    await this.ductape.dbUpdate('guilds', { id }, { $set: dto });

    const updated = (await this.findById(id)) as any;

    // Update graph node if needed
    if (dto.name || dto.accentColor) {
      await this.graphService.createGuildNode(
        id,
        updated.name,
        updated.slug,
        updated.accentColor,
      );
    }


    // Invalidate cache
    await this.ductape.cacheDelete('guilds:all');

    return updated;
  }


  async delete(id: string) {
    await this.findById(id); // Verify exists

    // Remove all memberships
    await this.ductape.dbDelete('user_guilds', { guildId: id });

    // Delete guild
    await this.ductape.dbDelete('guilds', { id });

    // Invalidate cache
    await this.ductape.cacheDelete('guilds:all');

    this.logger.log(`Deleted guild: ${id}`);
    return { success: true };
  }


  // ==================== MEMBERSHIP ====================

  async join(guildId: string, dto: JoinGuildDto) {
    const guild = await this.findById(guildId);

    // Check if already a member
    const existing = await this.ductape.dbFindOne('user_guilds', {
      userId: dto.userId,
      guildId,
    });

    if (existing) {
      throw new ConflictException('User is already a member of this guild');
    }

    // Get default edition if not specified
    const activeEditionId = dto.activeEditionId ||
      (guild as any).editions.find((e: any) => e.isDefault)?.id ||
      (guild as any).editions[0]?.id;

    const membership = {
      id: uuidv4(),
      userId: dto.userId,
      guildId,
      activeEditionId,
      joinedAt: new Date(),
    };

    await this.ductape.dbInsert('user_guilds', membership);

    // Update member count
    await this.ductape.dbUpdate('guilds', { id: guildId }, {
      $inc: { memberCount: 1 },
    });

    // Create graph relationship
    await this.graphService.userJoinsGuild(dto.userId, guildId);

    // Create user stats for this guild
    await this.ductape.dbInsert('user_stats', {
      id: uuidv4(),
      userId: dto.userId,
      guildId,
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      highestWinStreak: 0,
      totalPlayTime: 0,
      totalCreditsWon: 0,
      totalCreditsLost: 0,
      tournamentWins: 0,
      matchTypeBreakdown: [],
    });

    // Notify user
    await this.socialService.createNotification(
      dto.userId,
      'tournament_update', // Reusing type for now or add 'guild_joined'
      'Guild Joined',
      `You've successfully joined ${(guild as any).name}!`,
      { guildId },
    );

    this.logger.log(`User ${dto.userId} joined guild ${guildId}`);
    return { ...membership, guild };
  }

  async leave(guildId: string, userId: string) {
    await this.findById(guildId); // Verify guild exists

    const membership = await this.ductape.dbFindOne('user_guilds', { userId, guildId });
    if (!membership) {
      throw new NotFoundException('User is not a member of this guild');
    }

    await this.ductape.dbDelete('user_guilds', { userId, guildId });

    // Update member count
    await this.ductape.dbUpdate('guilds', { id: guildId }, {
      $inc: { memberCount: -1 },
    });

    // Remove graph relationship
    await this.graphService.userLeavesGuild(userId, guildId);

    this.logger.log(`User ${userId} left guild ${guildId}`);
    return { success: true };
  }

  async getUserGuilds(userId: string) {
    const memberships = await this.ductape.dbFindMany('user_guilds', { userId });

    const guildsWithDetails = await Promise.all(
      memberships.map(async (m: any) => {
        const guild = (await this.findById(m.guildId)) as any;
        return {
          guildId: m.guildId,
          guild,
          joinedAt: m.joinedAt,
          activeEditionId: m.activeEditionId,
        };
      })
    );

    return guildsWithDetails;
  }

  async getGuildMembers(guildId: string, options: { limit?: number; skip?: number } = {}) {
    await this.findById(guildId); // Verify guild exists

    const memberships = await this.ductape.dbFindMany('user_guilds', { guildId }, {
      limit: options.limit || 50,
      skip: options.skip || 0,
    });

    // Get user details for each membership
    const members = await Promise.all(
      memberships.map(async (m: any) => {
        const user = (await this.ductape.dbFindOne('users', { id: m.userId })) as any;
        if (!user) return null;
        const { password: _, ...userWithoutPassword } = user;
        return {

          ...userWithoutPassword,
          joinedAt: m.joinedAt,
          activeEditionId: m.activeEditionId,
        };
      })
    );

    return members.filter(Boolean);
  }

  async isGuildMember(userId: string, guildId: string): Promise<boolean> {
    const membership = await this.ductape.dbFindOne('user_guilds', { userId, guildId });
    return !!membership;
  }

  // ==================== EDITIONS ====================

  async setActiveEdition(userId: string, guildId: string, editionId: string) {
    const guild = (await this.findById(guildId)) as any;

    const editionExists = guild.editions.some((e: any) => e.id === editionId);

    if (!editionExists) {
      throw new NotFoundException(`Edition '${editionId}' not found in guild`);
    }

    await this.ductape.dbUpdate('user_guilds', { userId, guildId }, {
      $set: { activeEditionId: editionId },
    });

    return this.getUserMembership(userId, guildId);
  }

  async getUserMembership(userId: string, guildId: string) {
    const membership = await this.ductape.dbFindOne('user_guilds', { userId, guildId });
    if (!membership) {
      return null;
    }

    const guild = (await this.findById(guildId)) as any;
    return {
      guildId: (membership as any).guildId,
      guild,
      joinedAt: (membership as any).joinedAt,
      activeEditionId: (membership as any).activeEditionId,
    };

  }

  // ==================== ACTIVITY ====================

  async updateActiveNow(guildId: string) {
    // Count online users in this guild
    const memberships = await this.ductape.dbFindMany('user_guilds', { guildId });
    const userIds = memberships.map((m: any) => m.userId);

    const onlineCount = await this.ductape.dbCount('users', {
      id: { $in: userIds },
      isOnline: true,
    });

    await this.ductape.dbUpdate('guilds', { id: guildId }, {
      $set: { activeNow: onlineCount },
    });

    return onlineCount;
  }

  async getActiveNow(guildId: string) {
    const guild = (await this.findById(guildId)) as any;
    return guild.activeNow;
  }

}
