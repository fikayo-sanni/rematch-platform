import { Injectable, Logger } from '@nestjs/common';
import { DuctapeService } from '../config/ductape.config';

interface GraphNode {
  node: {
    id: string | number;
    labels?: string[];
    properties?: Record<string, unknown>;
  };
}

interface GraphRelationship {
  id: string | number;
  properties?: Record<string, unknown>;
}

interface TraverseResult {
  nodes?: Array<{
    id?: string | number;
    labels?: string[];
    properties?: Record<string, unknown>;
  }>;
  paths?: unknown[];
}

interface FindNodesResult {
  data?: Array<{
    id?: string | number;
    labels?: string[];
    properties?: Record<string, unknown>;
  }>;
}

interface FindRelationshipsResult {
  data?: GraphRelationship[];
}

@Injectable()
export class GraphSetupService {
  private readonly logger = new Logger(GraphSetupService.name);

  constructor(private readonly ductape: DuctapeService) {}

  setupGraph(): void {
    this.logger.log('Setting up graph database...');
    this.logger.log('Graph database setup complete');
  }

  // ==================== USER GRAPH OPERATIONS ====================

  async createUserNode(
    id: string,
    username: string,
    level: number,
    reputation: number = 0,
    isOnline: boolean = false,
  ): Promise<unknown> {
    return this.ductape.graphCreateNode(['User'], {
      id,
      username,
      level,
      reputation,
      isOnline,
      updatedAt: new Date().toISOString(),
    });
  }

  async createGuildNode(
    id: string,
    name: string,
    slug: string,
    accentColor: string = '#00FF00',
  ): Promise<unknown> {
    return this.ductape.graphCreateNode(['Guild'], {
      id,
      name,
      slug,
      accentColor,
      updatedAt: new Date().toISOString(),
    });
  }

  async createCrewNode(
    id: string,
    name: string,
    tag: string,
    rank: number = 0,
  ): Promise<unknown> {
    return this.ductape.graphCreateNode(['Crew'], {
      id,
      name,
      tag,
      rank,
      updatedAt: new Date().toISOString(),
    });
  }

  async createMatchNode(
    id: string,
    winnerId: string,
    completedAt: Date = new Date(),
  ): Promise<unknown> {
    return this.ductape.graphCreateNode(['Match'], {
      id,
      winnerId,
      completedAt: completedAt.toISOString(),
    });
  }

  // ==================== RELATIONSHIP OPERATIONS ====================

  async userJoinsGuild(userId: string, guildId: string): Promise<unknown> {
    return this.ductape.graphCreateRelationship('MEMBER_OF', userId, guildId, {
      joinedAt: new Date().toISOString(),
    });
  }

  async userLeavesGuild(userId: string, guildId: string): Promise<unknown> {
    const relationships = (await this.ductape.graphFindRelationships({
      types: ['MEMBER_OF'],
      startNodeId: userId,
      endNodeId: guildId,
    })) as FindRelationshipsResult;

    if (relationships?.data?.[0]?.id) {
      return this.ductape.graphDeleteRelationship(relationships.data[0].id);
    }
    return null;
  }

  async userJoinsCrew(
    userId: string,
    crewId: string,
    role: string = 'member',
  ): Promise<unknown> {
    return this.ductape.graphCreateRelationship('BELONGS_TO', userId, crewId, {
      role,
      joinedAt: new Date().toISOString(),
    });
  }

  async userLeavesCrew(userId: string, crewId: string): Promise<unknown> {
    const relationships = (await this.ductape.graphFindRelationships({
      types: ['BELONGS_TO'],
      startNodeId: userId,
      endNodeId: crewId,
    })) as FindRelationshipsResult;

    if (relationships?.data?.[0]?.id) {
      return this.ductape.graphDeleteRelationship(relationships.data[0].id);
    }
    return null;
  }

  async userFollowsUser(
    followerId: string,
    followedId: string,
  ): Promise<unknown> {
    return this.ductape.graphCreateRelationship(
      'FOLLOWS',
      followerId,
      followedId,
      { createdAt: new Date().toISOString() },
    );
  }

  async userUnfollowsUser(
    followerId: string,
    followedId: string,
  ): Promise<unknown> {
    const relationships = (await this.ductape.graphFindRelationships({
      types: ['FOLLOWS'],
      startNodeId: followerId,
      endNodeId: followedId,
    })) as FindRelationshipsResult;

    if (relationships?.data?.[0]?.id) {
      return this.ductape.graphDeleteRelationship(relationships.data[0].id);
    }
    return null;
  }

  async recordMatch(
    matchId: string,
    player1Id: string,
    player2Id: string,
    winnerId: string,
    guildId: string,
  ): Promise<unknown> {
    // Create Match node
    const matchNode = (await this.createMatchNode(
      matchId,
      winnerId,
    )) as GraphNode;
    const matchNodeId = matchNode.node.id;

    // Create PLAYED_IN relationships
    await this.ductape.graphCreateRelationship(
      'PLAYED_IN',
      player1Id,
      matchNodeId,
      { side: 'player1' },
    );

    await this.ductape.graphCreateRelationship(
      'PLAYED_IN',
      player2Id,
      matchNodeId,
      { side: 'player2' },
    );

    // Create IN_GUILD relationship
    await this.ductape.graphCreateRelationship(
      'IN_GUILD',
      matchNodeId,
      guildId,
      {},
    );

    // Create/update PLAYED_AGAINST relationships
    await this.createOrUpdatePlayedAgainst(player1Id, player2Id);
    await this.createOrUpdatePlayedAgainst(player2Id, player1Id);

    return matchNode;
  }

  private async createOrUpdatePlayedAgainst(
    player1Id: string,
    player2Id: string,
  ): Promise<unknown> {
    // Check if relationship exists
    const existing = (await this.ductape.graphFindRelationships({
      types: ['PLAYED_AGAINST'],
      startNodeId: player1Id,
      endNodeId: player2Id,
    })) as FindRelationshipsResult;

    if (existing?.data?.[0]) {
      // Update match count
      const currentCount =
        (existing.data[0].properties?.matchCount as number) || 0;
      return this.ductape.graphUpdateRelationship(existing.data[0].id, {
        matchCount: currentCount + 1,
      });
    } else {
      // Create new relationship
      return this.ductape.graphCreateRelationship(
        'PLAYED_AGAINST',
        player1Id,
        player2Id,
        { matchCount: 1 },
      );
    }
  }

  // ==================== GRAPH QUERIES ====================

  async getUserGuilds(userId: string): Promise<unknown> {
    const result = await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'outgoing',
      relationshipTypes: ['MEMBER_OF'],
      maxDepth: 1,
    });
    return result;
  }

  async getGuildMembers(
    guildId: string,
    limit: number = 50,
  ): Promise<{ data: unknown[] }> {
    const result = (await this.ductape.graphTraverse({
      startNodeId: guildId,
      direction: 'incoming',
      relationshipTypes: ['MEMBER_OF'],
      maxDepth: 1,
    })) as TraverseResult;

    // Filter to User nodes and apply limit
    const users =
      result?.nodes?.filter((n) => n.labels?.includes('User')) || [];

    return {
      data: users.slice(0, limit),
    };
  }

  async getCrewMembers(crewId: string): Promise<unknown> {
    const result = await this.ductape.graphTraverse({
      startNodeId: crewId,
      direction: 'incoming',
      relationshipTypes: ['BELONGS_TO'],
      maxDepth: 1,
    });

    return result;
  }

  async getOnlineFriends(userId: string): Promise<{ data: unknown[] }> {
    const result = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'outgoing',
      relationshipTypes: ['FOLLOWS'],
      maxDepth: 1,
    })) as TraverseResult;

    // Filter to online users
    const onlineFriends =
      result?.nodes?.filter(
        (n) => n.labels?.includes('User') && n.properties?.isOnline === true,
      ) || [];

    return { data: onlineFriends };
  }

  async getMatchHistory(
    userId: string,
    limit: number = 10,
  ): Promise<{ data: unknown[] }> {
    const result = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'outgoing',
      relationshipTypes: ['PLAYED_IN'],
      maxDepth: 2,
    })) as TraverseResult;

    // Filter to Match nodes
    const matches =
      result?.nodes?.filter((n) => n.labels?.includes('Match')) || [];

    return {
      data: matches.slice(0, limit),
    };
  }

  async getFrequentOpponents(
    userId: string,
    limit: number = 5,
  ): Promise<{ data: unknown[] }> {
    const relationships = (await this.ductape.graphFindRelationships({
      types: ['PLAYED_AGAINST'],
      startNodeId: userId,
    })) as FindRelationshipsResult;

    // Sort by matchCount and limit
    const sorted = (relationships?.data || [])
      .sort(
        (a, b) =>
          ((b.properties?.matchCount as number) || 0) -
          ((a.properties?.matchCount as number) || 0),
      )
      .slice(0, limit);

    return { data: sorted };
  }

  async getSuggestedOpponents(
    userId: string,
    guildId: string,
    limit: number = 10,
  ): Promise<{ data: unknown[] }> {
    // Get guild members
    const guildMembers = await this.getGuildMembers(guildId, 100);

    // Get user's level for skill matching
    const userNodes = (await this.ductape.graphFindNodes(['User'], {
      id: userId,
    })) as FindNodesResult;
    const userLevel = (userNodes?.data?.[0]?.properties?.level as number) || 0;

    // Filter members
    const candidates = (
      guildMembers?.data as Array<{
        properties?: Record<string, unknown>;
        id?: string;
      }>
    ).filter((member) => {
      const memberId = (member.properties?.id as string) || member.id;
      const memberLevel = (member.properties?.level as number) || 0;
      const isOnline = (member.properties?.isOnline as boolean) || false;

      return (
        memberId !== userId &&
        isOnline &&
        Math.abs(memberLevel - userLevel) <= 5
      );
    });

    return { data: candidates.slice(0, limit) };
  }

  async getMutualCrewmates(
    userId1: string,
    userId2: string,
  ): Promise<{ data: unknown[] }> {
    // Get crews for both users
    const user1Crews = (await this.ductape.graphTraverse({
      startNodeId: userId1,
      direction: 'outgoing',
      relationshipTypes: ['BELONGS_TO'],
      maxDepth: 1,
    })) as TraverseResult;

    const user2Crews = (await this.ductape.graphTraverse({
      startNodeId: userId2,
      direction: 'outgoing',
      relationshipTypes: ['BELONGS_TO'],
      maxDepth: 1,
    })) as TraverseResult;

    // Find intersection
    const crews1 =
      user1Crews?.nodes?.filter((n) => n.labels?.includes('Crew')) || [];
    const crews2 =
      user2Crews?.nodes?.filter((n) => n.labels?.includes('Crew')) || [];

    const crew2Ids = new Set(
      crews2.map((c) => (c.properties?.id as string) || c.id),
    );
    const mutual = crews1.filter((c) =>
      crew2Ids.has((c.properties?.id as string) || (c.id as string)),
    );

    return { data: mutual };
  }

  async getCrewRankings(limit: number = 10): Promise<{ data: unknown[] }> {
    const crews = (await this.ductape.graphFindNodes([
      'Crew',
    ])) as FindNodesResult;

    // Sort by rank
    const sorted = (crews?.data || [])
      .sort(
        (a, b) =>
          ((a.properties?.rank as number) || 0) -
          ((b.properties?.rank as number) || 0),
      )
      .slice(0, limit);

    return { data: sorted };
  }

  // ==================== ANALYTICS QUERIES ====================

  async getGuildActivityStats(guildId: string): Promise<{
    guild: unknown;
    totalMembers: number;
    onlineMembers: number;
    weeklyMatches: number;
  }> {
    // Get guild node
    const guildNodes = (await this.ductape.graphFindNodes(['Guild'], {
      id: guildId,
    })) as FindNodesResult;
    const guild = guildNodes?.data?.[0];

    // Get members
    const members = await this.getGuildMembers(guildId, 1000);
    const totalMembers = members?.data?.length || 0;
    const onlineMembers =
      (
        members?.data as Array<{ properties?: Record<string, unknown> }>
      )?.filter((m) => m.properties?.isOnline)?.length || 0;

    // Get matches in guild (approximate - would need time filtering)
    const matchTraversal = (await this.ductape.graphTraverse({
      startNodeId: guildId,
      direction: 'incoming',
      relationshipTypes: ['IN_GUILD'],
      maxDepth: 1,
    })) as TraverseResult;
    const weeklyMatches =
      matchTraversal?.nodes?.filter((n) => n.labels?.includes('Match'))
        ?.length || 0;

    return {
      guild,
      totalMembers,
      onlineMembers,
      weeklyMatches,
    };
  }

  async getUserNetworkStats(userId: string): Promise<{
    user: unknown;
    followingCount: number;
    followerCount: number;
    crewCount: number;
    guildCount: number;
  }> {
    // Get user node
    const userNodes = (await this.ductape.graphFindNodes(['User'], {
      id: userId,
    })) as FindNodesResult;
    const user = userNodes?.data?.[0];

    // Get following count
    const following = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'outgoing',
      relationshipTypes: ['FOLLOWS'],
      maxDepth: 1,
    })) as TraverseResult;
    const followingCount =
      following?.nodes?.filter((n) => n.labels?.includes('User'))?.length || 0;

    // Get follower count
    const followers = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'incoming',
      relationshipTypes: ['FOLLOWS'],
      maxDepth: 1,
    })) as TraverseResult;
    const followerCount =
      followers?.nodes?.filter((n) => n.labels?.includes('User'))?.length || 0;

    // Get crew count
    const crews = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'outgoing',
      relationshipTypes: ['BELONGS_TO'],
      maxDepth: 1,
    })) as TraverseResult;
    const crewCount =
      crews?.nodes?.filter((n) => n.labels?.includes('Crew'))?.length || 0;

    // Get guild count
    const guilds = (await this.ductape.graphTraverse({
      startNodeId: userId,
      direction: 'outgoing',
      relationshipTypes: ['MEMBER_OF'],
      maxDepth: 1,
    })) as TraverseResult;
    const guildCount =
      guilds?.nodes?.filter((n) => n.labels?.includes('Guild'))?.length || 0;

    return {
      user,
      followingCount,
      followerCount,
      crewCount,
      guildCount,
    };
  }

  // ==================== UPDATE OPERATIONS ====================

  async updateUserNode(
    id: string,
    properties: Record<string, unknown>,
  ): Promise<unknown> {
    return this.ductape.graphUpdateNode(id, {
      ...properties,
      updatedAt: new Date().toISOString(),
    });
  }

  async updateGuildNode(
    id: string,
    properties: Record<string, unknown>,
  ): Promise<unknown> {
    return this.ductape.graphUpdateNode(id, {
      ...properties,
      updatedAt: new Date().toISOString(),
    });
  }

  async updateCrewNode(
    id: string,
    properties: Record<string, unknown>,
  ): Promise<unknown> {
    return this.ductape.graphUpdateNode(id, {
      ...properties,
      updatedAt: new Date().toISOString(),
    });
  }

  // ==================== DELETE OPERATIONS ====================

  async deleteUserNode(id: string): Promise<unknown> {
    return this.ductape.graphDeleteNode(id);
  }

  async deleteGuildNode(id: string): Promise<unknown> {
    return this.ductape.graphDeleteNode(id);
  }

  async deleteCrewNode(id: string): Promise<unknown> {
    return this.ductape.graphDeleteNode(id);
  }

  async deleteMatchNode(id: string): Promise<unknown> {
    return this.ductape.graphDeleteNode(id);
  }

  // ==================== FIND OPERATIONS ====================

  async findUserById(id: string): Promise<unknown> {
    const result = (await this.ductape.graphFindNodes(['User'], {
      id,
    })) as FindNodesResult;
    return result?.data?.[0] || null;
  }

  async findGuildById(id: string): Promise<unknown> {
    const result = (await this.ductape.graphFindNodes(['Guild'], {
      id,
    })) as FindNodesResult;
    return result?.data?.[0] || null;
  }

  async findCrewById(id: string): Promise<unknown> {
    const result = (await this.ductape.graphFindNodes(['Crew'], {
      id,
    })) as FindNodesResult;
    return result?.data?.[0] || null;
  }

  async findOnlineUsers(limit: number = 50): Promise<{ data: unknown[] }> {
    const result = (await this.ductape.graphFindNodes(['User'], {
      isOnline: true,
    })) as FindNodesResult;
    return {
      data: (result?.data || []).slice(0, limit),
    };
  }
}
