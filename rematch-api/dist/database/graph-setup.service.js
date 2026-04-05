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
var GraphSetupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphSetupService = void 0;
const common_1 = require("@nestjs/common");
const ductape_config_1 = require("../config/ductape.config");
let GraphSetupService = GraphSetupService_1 = class GraphSetupService {
    ductape;
    logger = new common_1.Logger(GraphSetupService_1.name);
    constructor(ductape) {
        this.ductape = ductape;
    }
    async setupGraph() {
        this.logger.log('Setting up graph database schema...');
        await this.createConstraints();
        await this.createGraphIndexes();
        this.logger.log('Graph database setup complete');
    }
    async createConstraints() {
        await this.ductape.graphQuery(`
      CREATE CONSTRAINT user_id IF NOT EXISTS
      FOR (u:User) REQUIRE u.id IS UNIQUE
    `);
        await this.ductape.graphQuery(`
      CREATE CONSTRAINT guild_id IF NOT EXISTS
      FOR (g:Guild) REQUIRE g.id IS UNIQUE
    `);
        await this.ductape.graphQuery(`
      CREATE CONSTRAINT crew_id IF NOT EXISTS
      FOR (c:Crew) REQUIRE c.id IS UNIQUE
    `);
        await this.ductape.graphQuery(`
      CREATE CONSTRAINT match_id IF NOT EXISTS
      FOR (m:Match) REQUIRE m.id IS UNIQUE
    `);
        this.logger.log('Graph constraints created');
    }
    async createGraphIndexes() {
        await this.ductape.graphQuery(`
      CREATE INDEX user_username IF NOT EXISTS
      FOR (u:User) ON (u.username)
    `);
        await this.ductape.graphQuery(`
      CREATE INDEX user_online IF NOT EXISTS
      FOR (u:User) ON (u.isOnline)
    `);
        await this.ductape.graphQuery(`
      CREATE INDEX guild_slug IF NOT EXISTS
      FOR (g:Guild) ON (g.slug)
    `);
        this.logger.log('Graph indexes created');
    }
    async createUserNode(id, username, level, reputation = 0, isOnline = false) {
        return this.ductape.graphQuery(`
      MERGE (u:User {id: $id})
      SET u.username = $username,
          u.level = $level,
          u.reputation = $reputation,
          u.isOnline = $isOnline,
          u.updatedAt = datetime()
      RETURN u
      `, { id, username, level, reputation, isOnline });
    }
    async createGuildNode(id, name, slug, accentColor = '#00FF00') {
        return this.ductape.graphQuery(`
      MERGE (g:Guild {id: $id})
      SET g.name = $name,
          g.slug = $slug,
          g.accentColor = $accentColor,
          g.updatedAt = datetime()
      RETURN g
      `, { id, name, slug, accentColor });
    }
    async createCrewNode(id, name, tag, rank = 0) {
        return this.ductape.graphQuery(`
      MERGE (c:Crew {id: $id})
      SET c.name = $name,
          c.tag = $tag,
          c.rank = $rank,
          c.updatedAt = datetime()
      RETURN c
      `, { id, name, tag, rank });
    }
    async userJoinsGuild(userId, guildId) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})
      MATCH (g:Guild {id: $guildId})
      MERGE (u)-[r:MEMBER_OF]->(g)
      SET r.joinedAt = datetime()
      RETURN u, r, g
      `, { userId, guildId });
    }
    async userLeavesGuild(userId, guildId) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})-[r:MEMBER_OF]->(g:Guild {id: $guildId})
      DELETE r
      `, { userId, guildId });
    }
    async userJoinsCrew(userId, crewId, role = 'member') {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})
      MATCH (c:Crew {id: $crewId})
      MERGE (u)-[r:BELONGS_TO]->(c)
      SET r.role = $role, r.joinedAt = datetime()
      RETURN u, r, c
      `, { userId, crewId, role });
    }
    async userLeavesCrew(userId, crewId) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})-[r:BELONGS_TO]->(c:Crew {id: $crewId})
      DELETE r
      `, { userId, crewId });
    }
    async userFollowsUser(followerId, followedId) {
        return this.ductape.graphQuery(`
      MATCH (follower:User {id: $followerId})
      MATCH (followed:User {id: $followedId})
      MERGE (follower)-[r:FOLLOWS]->(followed)
      SET r.createdAt = datetime()
      RETURN follower, r, followed
      `, { followerId, followedId });
    }
    async userUnfollowsUser(followerId, followedId) {
        return this.ductape.graphQuery(`
      MATCH (follower:User {id: $followerId})-[r:FOLLOWS]->(followed:User {id: $followedId})
      DELETE r
      `, { followerId, followedId });
    }
    async recordMatch(matchId, player1Id, player2Id, winnerId, guildId) {
        return this.ductape.graphQuery(`
      MATCH (p1:User {id: $player1Id})
      MATCH (p2:User {id: $player2Id})
      MATCH (g:Guild {id: $guildId})

      CREATE (m:Match {id: $matchId, winnerId: $winnerId, completedAt: datetime()})

      CREATE (p1)-[:PLAYED_IN {side: 'player1'}]->(m)
      CREATE (p2)-[:PLAYED_IN {side: 'player2'}]->(m)
      CREATE (m)-[:IN_GUILD]->(g)

      WITH p1, p2, m, $winnerId AS winnerId

      MERGE (p1)-[h:PLAYED_AGAINST]->(p2)
      ON CREATE SET h.matchCount = 1
      ON MATCH SET h.matchCount = h.matchCount + 1

      MERGE (p2)-[h2:PLAYED_AGAINST]->(p1)
      ON CREATE SET h2.matchCount = 1
      ON MATCH SET h2.matchCount = h2.matchCount + 1

      RETURN m
      `, { matchId, player1Id, player2Id, winnerId, guildId });
    }
    async getUserGuilds(userId) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})-[:MEMBER_OF]->(g:Guild)
      RETURN g
      `, { userId });
    }
    async getGuildMembers(guildId, limit = 50) {
        return this.ductape.graphQuery(`
      MATCH (u:User)-[:MEMBER_OF]->(g:Guild {id: $guildId})
      RETURN u
      ORDER BY u.level DESC
      LIMIT $limit
      `, { guildId, limit });
    }
    async getCrewMembers(crewId) {
        return this.ductape.graphQuery(`
      MATCH (u:User)-[r:BELONGS_TO]->(c:Crew {id: $crewId})
      RETURN u, r.role AS role
      ORDER BY
        CASE r.role
          WHEN 'leader' THEN 0
          WHEN 'officer' THEN 1
          ELSE 2
        END,
        u.level DESC
      `, { crewId });
    }
    async getOnlineFriends(userId) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})-[:FOLLOWS]->(friend:User)
      WHERE friend.isOnline = true
      RETURN friend
      ORDER BY friend.username
      `, { userId });
    }
    async getMatchHistory(userId, limit = 10) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})-[:PLAYED_IN]->(m:Match)<-[:PLAYED_IN]-(opponent:User)
      WHERE opponent.id <> $userId
      MATCH (m)-[:IN_GUILD]->(g:Guild)
      RETURN m, opponent, g
      ORDER BY m.completedAt DESC
      LIMIT $limit
      `, { userId, limit });
    }
    async getFrequentOpponents(userId, limit = 5) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})-[r:PLAYED_AGAINST]->(opponent:User)
      RETURN opponent, r.matchCount AS matchCount
      ORDER BY r.matchCount DESC
      LIMIT $limit
      `, { userId, limit });
    }
    async getSuggestedOpponents(userId, guildId, limit = 10) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})-[:MEMBER_OF]->(g:Guild {id: $guildId})
      MATCH (candidate:User)-[:MEMBER_OF]->(g)
      WHERE candidate.id <> $userId
        AND candidate.isOnline = true
        AND abs(candidate.level - u.level) <= 5

      // Prefer users not recently played against
      OPTIONAL MATCH (u)-[r:PLAYED_AGAINST]->(candidate)

      RETURN candidate, COALESCE(r.matchCount, 0) AS previousMatches
      ORDER BY previousMatches ASC, abs(candidate.level - u.level) ASC
      LIMIT $limit
      `, { userId, guildId, limit });
    }
    async getMutualCrewmates(userId1, userId2) {
        return this.ductape.graphQuery(`
      MATCH (u1:User {id: $userId1})-[:BELONGS_TO]->(c:Crew)<-[:BELONGS_TO]-(u2:User {id: $userId2})
      RETURN c
      `, { userId1, userId2 });
    }
    async getCrewRankings(limit = 10) {
        return this.ductape.graphQuery(`
      MATCH (c:Crew)
      OPTIONAL MATCH (u:User)-[:BELONGS_TO]->(c)
      WITH c, COUNT(u) AS memberCount
      RETURN c, memberCount
      ORDER BY c.rank ASC
      LIMIT $limit
      `, { limit });
    }
    async getGuildActivityStats(guildId) {
        return this.ductape.graphQuery(`
      MATCH (g:Guild {id: $guildId})
      OPTIONAL MATCH (u:User)-[:MEMBER_OF]->(g)
      WITH g, COUNT(u) AS totalMembers,
           SUM(CASE WHEN u.isOnline THEN 1 ELSE 0 END) AS onlineMembers
      OPTIONAL MATCH (m:Match)-[:IN_GUILD]->(g)
      WHERE m.completedAt >= datetime() - duration('P7D')
      RETURN g, totalMembers, onlineMembers, COUNT(m) AS weeklyMatches
      `, { guildId });
    }
    async getUserNetworkStats(userId) {
        return this.ductape.graphQuery(`
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:FOLLOWS]->(following:User)
      OPTIONAL MATCH (follower:User)-[:FOLLOWS]->(u)
      OPTIONAL MATCH (u)-[:BELONGS_TO]->(crew:Crew)
      OPTIONAL MATCH (u)-[:MEMBER_OF]->(guild:Guild)
      RETURN u,
             COUNT(DISTINCT following) AS followingCount,
             COUNT(DISTINCT follower) AS followerCount,
             COUNT(DISTINCT crew) AS crewCount,
             COUNT(DISTINCT guild) AS guildCount
      `, { userId });
    }
};
exports.GraphSetupService = GraphSetupService;
exports.GraphSetupService = GraphSetupService = GraphSetupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ductape_config_1.DuctapeService])
], GraphSetupService);
//# sourceMappingURL=graph-setup.service.js.map