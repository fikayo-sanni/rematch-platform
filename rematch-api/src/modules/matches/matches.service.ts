import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { DuctapeService } from '../../config/ductape.config';
import { GraphSetupService } from '../../database/graph-setup.service';
import { UsersService } from '../users/users.service';
import {
  CreatePullDto,
  AcceptPullDto,
  CreateCallDto,
  CreateMatchDto,
  SubmitResultDto,
  CreateSpotcheckDto,
  AddEvidenceDto,
  ResolveSpotcheckDto,
} from './dto/match.dto';
import { SocialService } from '../social/social.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    private readonly ductape: DuctapeService,
    private readonly graphService: GraphSetupService,
    private readonly usersService: UsersService,
    private readonly socialService: SocialService,
  ) {}

  // ==================== PULLS (Quick Matches) ====================

  async createPull(dto: CreatePullDto) {
    const pullId = uuidv4();
    const expiryMinutes = dto.expiryMinutes || 5;

    const pull = {
      id: pullId,
      guildId: dto.guildId,
      editionId: dto.editionId,
      initiatorId: dto.initiatorId,
      opponentId: null,
      creditPot: dto.creditPot,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
    };

    await this.ductape.dbInsert('pulls', pull);

    const initiator = await this.usersService.findById(dto.initiatorId);

    this.logger.log(`Created pull ${pullId} by ${dto.initiatorId}`);
    return { ...pull, initiator };
  }

  async acceptPull(pullId: string, dto: AcceptPullDto) {
    const pull = (await this.ductape.dbFindOne('pulls', { id: pullId })) as any;
    if (!pull) {
      throw new NotFoundException(`Pull ${pullId} not found`);
    }

    if (pull.status !== 'pending') {
      throw new ConflictException(`Pull is already ${pull.status}`);
    }

    if (new Date(pull.expiresAt) < new Date()) {
      await this.ductape.dbUpdate('pulls', { id: pullId }, { $set: { status: 'expired' } });
      throw new ConflictException('Pull has expired');
    }

    // Update pull
    await this.ductape.dbUpdate('pulls', { id: pullId }, {
      $set: { opponentId: dto.opponentId, status: 'accepted' },
    });

    // Create match from pull
    const match = await this.createMatch({
      type: 'pull',
      guildId: pull.guildId,
      editionId: pull.editionId,
      player1Id: pull.initiatorId,
      player2Id: dto.opponentId,
      creditPot: pull.creditPot,
    });

    return match;
  }

  async declinePull(pullId: string, opponentId: string) {
    const pull = await this.ductape.dbFindOne('pulls', { id: pullId });
    if (!pull) {
      throw new NotFoundException(`Pull ${pullId} not found`);
    }

    await this.ductape.dbUpdate('pulls', { id: pullId }, {
      $set: { status: 'declined', opponentId },
    });

    return { success: true };
  }

  async getPull(id: string) {
    const pull = (await this.ductape.dbFindOne('pulls', { id })) as any;
    if (!pull) {
      throw new NotFoundException(`Pull ${id} not found`);
    }

    const initiator = await this.usersService.findById(pull.initiatorId);
    const opponent = pull.opponentId ? await this.usersService.findById(pull.opponentId) : null;

    return { ...pull, initiator, opponent };
  }

  async getPendingPulls(guildId: string, editionId?: string) {
    const query: any = { guildId, status: 'pending' };
    if (editionId) query.editionId = editionId;

    const pulls = await this.ductape.dbFindMany('pulls', query, {
      sort: { createdAt: -1 },
    });

    // Filter expired
    const now = new Date();
    const validPulls = pulls.filter((p: any) => new Date(p.expiresAt) > now);

    // Enrich with user data
    return Promise.all(
      validPulls.map(async (pull: any) => {
        const initiator = await this.usersService.findById(pull.initiatorId);
        return { ...pull, initiator };
      })
    );
  }

  async getUserPulls(userId: string, status?: string) {
    // Split $or query into two queries since Ductape SDK currently expects flat key-value matches
    const [initiatorPulls, opponentPulls] = await Promise.all([
      this.ductape.dbFindMany('pulls', { initiatorId: userId, ...(status ? { status } : {}) }),
      this.ductape.dbFindMany('pulls', { opponentId: userId, ...(status ? { status } : {}) }),
    ]);

    // Merge and remove duplicates (by id)
    const combinedPulls = [...initiatorPulls, ...opponentPulls];
    const uniquePulls = Array.from(new Map(combinedPulls.map((p: any) => [p.id, p])).values());

    // Sort by createdAt desc
    uniquePulls.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return Promise.all(
      uniquePulls.map(async (pull: any) => {
        const initiator = await this.usersService.findById(pull.initiatorId);
        const opponent = pull.opponentId ? await this.usersService.findById(pull.opponentId) : null;
        return { ...pull, initiator, opponent };
      })
    );
  }

  // ==================== CALLS (Challenges) ====================

  async createCall(dto: CreateCallDto) {
    const callId = uuidv4();
    const expiryMinutes = dto.expiryMinutes || 60;

    const call = {
      id: callId,
      guildId: dto.guildId,
      editionId: dto.editionId,
      challengerId: dto.challengerId,
      challengedId: dto.challengedId,
      creditPot: dto.creditPot,
      message: dto.message,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
    };

    await this.ductape.dbInsert('calls', call);

    // Create notification for challenged user
    await this.socialService.createNotification(
      dto.challengedId,
      'challenge_received',
      'New Challenge!',
      `You've been challenged! ${dto.creditPot} credits on the line.`,
      { callId, challengerId: dto.challengerId },
    );

    const challenger = await this.usersService.findById(dto.challengerId);
    const challenged = await this.usersService.findById(dto.challengedId);

    this.logger.log(`Created call ${callId}: ${dto.challengerId} vs ${dto.challengedId}`);
    return { ...call, challenger, challenged };
  }

  async acceptCall(callId: string) {
    const call = (await this.ductape.dbFindOne('calls', { id: callId })) as any;
    if (!call) {
      throw new NotFoundException(`Call ${callId} not found`);
    }

    if (call.status !== 'pending') {
      throw new ConflictException(`Call is already ${call.status}`);
    }

    if (new Date(call.expiresAt) < new Date()) {
      await this.ductape.dbUpdate('calls', { id: callId }, { $set: { status: 'expired' } });
      throw new ConflictException('Challenge has expired');
    }

    // Update call
    await this.ductape.dbUpdate('calls', { id: callId }, { $set: { status: 'accepted' } });

    // Create match from call
    const match = (await this.createMatch({
      type: 'call',
      guildId: call.guildId,
      editionId: call.editionId,
      player1Id: call.challengerId,
      player2Id: call.challengedId,
      creditPot: call.creditPot,
      context: { type: 'challenge', id: callId, name: 'Challenge Match' },
    })) as any;

    // Notify challenger
    await this.socialService.createNotification(
      call.challengerId,
      'challenge_accepted',
      'Challenge Accepted!',
      'Your challenge has been accepted. Get ready!',
      { callId, matchId: match.id },
    );

    return match;
  }

  async declineCall(callId: string) {
    const call = await this.ductape.dbFindOne('calls', { id: callId });
    if (!call) {
      throw new NotFoundException(`Call ${callId} not found`);
    }

    await this.ductape.dbUpdate('calls', { id: callId }, { $set: { status: 'declined' } });

    return { success: true };
  }

  async getCall(id: string) {
    const call = (await this.ductape.dbFindOne('calls', { id })) as any;
    if (!call) {
      throw new NotFoundException(`Call ${id} not found`);
    }

    const challenger = await this.usersService.findById(call.challengerId);
    const challenged = await this.usersService.findById(call.challengedId);

    return { ...call, challenger, challenged };
  }

  async getPendingCalls(guildId: string, status?: string) {
    const query: any = { guildId };
    if (status) query.status = status;
    else query.status = 'pending';

    const calls = await this.ductape.dbFindMany('calls', query, {
      sort: { createdAt: -1 },
    });

    // Filter expired
    const now = new Date();
    const validCalls = calls.filter((c: any) =>
      c.status !== 'pending' || new Date(c.expiresAt) > now
    );

    return Promise.all(
      validCalls.map(async (call: any) => {
        const challenger = await this.usersService.findById(call.challengerId);
        const challenged = await this.usersService.findById(call.challengedId);
        return { ...call, challenger, challenged };
      })
    );
  }

  async getUserCalls(userId: string, type?: 'sent' | 'received') {
    let query: any;
    if (type === 'sent') {
      query = { challengerId: userId };
    } else if (type === 'received') {
      query = { challengedId: userId };
    } else {
      // For combined, we need two queries
      const [sentCalls, receivedCalls] = await Promise.all([
        this.ductape.dbFindMany('calls', { challengerId: userId }),
        this.ductape.dbFindMany('calls', { challengedId: userId }),
      ]);
      const combinedCalls = [...sentCalls, ...receivedCalls] as any[];
      const uniqueCalls = Array.from(new Map(combinedCalls.map((c: any) => [c.id, c])).values());
      uniqueCalls.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return Promise.all(
        uniqueCalls.map(async (call: any) => {
          const challenger = await this.usersService.findById(call.challengerId);
          const challenged = await this.usersService.findById(call.challengedId);
          return { ...call, challenger, challenged };
        })
      );
    }

    const calls = await this.ductape.dbFindMany('calls', query, {
      sort: { createdAt: -1 },
    });

    return Promise.all(
      calls.map(async (call: any) => {
        const challenger = await this.usersService.findById(call.challengerId);
        const challenged = await this.usersService.findById(call.challengedId);
        return { ...call, challenger, challenged };
      })
    );
  }

  // ==================== MATCHES ====================

  async createMatch(dto: CreateMatchDto) {
    const matchId = uuidv4();

    const match = {
      id: matchId,
      type: dto.type,
      guildId: dto.guildId,
      editionId: dto.editionId,
      player1Id: dto.player1Id,
      player2Id: dto.player2Id,
      status: 'accepted',
      creditPot: dto.creditPot,
      createdAt: new Date(),
      scheduledAt: dto.scheduledAt,
      context: dto.context,
    };

    await this.ductape.dbInsert('matches', match);

    const player1 = await this.usersService.findById(dto.player1Id);
    const player2 = await this.usersService.findById(dto.player2Id);

    this.logger.log(`Created match ${matchId}: ${dto.player1Id} vs ${dto.player2Id}`);
    return { ...match, player1, player2 };
  }

  async startMatch(matchId: string) {
    const match = (await this.ductape.dbFindOne('matches', { id: matchId })) as any;
    if (!match) {
      throw new NotFoundException(`Match ${matchId} not found`);
    }

    if (match.status !== 'accepted') {
      throw new ConflictException(`Match cannot be started - status is ${match.status}`);
    }

    await this.ductape.dbUpdate('matches', { id: matchId }, {
      $set: { status: 'in_progress', startedAt: new Date() },
    });

    // Create live match entry
    await this.ductape.dbInsert('live_matches', {
      id: uuidv4(),
      matchId,
      score: { player1: 0, player2: 0 },
      viewers: 0,
      duration: '00:00',
      startedAt: new Date(),
      isLive: true,
    });

    return this.getMatch(matchId);
  }

  async submitResult(matchId: string, dto: SubmitResultDto, submitterId: string) {
    const match = (await this.ductape.dbFindOne('matches', { id: matchId })) as any;
    if (!match) {
      throw new NotFoundException(`Match ${matchId} not found`);
    }

    if (match.status !== 'in_progress') {
      throw new ConflictException(`Match is not in progress`);
    }

    const loserId = dto.winnerId === match.player1Id ? match.player2Id : match.player1Id;

    const result = {
      winnerId: dto.winnerId,
      loserId,
      winnerScore: dto.winnerScore,
      loserScore: dto.loserScore,
      duration: dto.duration || 0,
    };

    await this.ductape.dbUpdate('matches', { id: matchId }, {
      $set: {
        status: 'completed',
        completedAt: new Date(),
        result,
      },
    });

    // End live match
    await this.ductape.dbUpdate('live_matches', { matchId }, {
      $set: { isLive: false },
    });

    // Update user stats
    await this.usersService.updateUserStats(dto.winnerId, match.guildId, {
      won: true,
      creditsWon: (match as any).creditPot,
    });

    await this.usersService.updateUserStats(loserId, (match as any).guildId, {
      won: false,
    });

    // Transfer credits
    await this.usersService.updateCredits(dto.winnerId, {
      amount: (match as any).creditPot,
      type: 'rc',
      operation: 'add',
    });

    // Record in graph
    await this.graphService.recordMatch(
      matchId,
      (match as any).player1Id,
      (match as any).player2Id,
      dto.winnerId,
      (match as any).guildId
    );

    // Notify other player
    const otherPlayerId = (match as any).player1Id === submitterId ? (match as any).player2Id : (match as any).player1Id;
    await this.socialService.createNotification(
      otherPlayerId,
      'match_update',
      'Match Result Submitted',
      `Result has been submitted for your match. Please confirm.`,
      { matchId },
    );

    this.logger.log(`Match ${matchId} completed - Winner: ${dto.winnerId}`);
    return this.getMatch(matchId);
  }

  async disputeMatch(matchId: string, userId: string) {
    const match = (await this.ductape.dbFindOne('matches', { id: matchId })) as any;
    if (!match) {
      throw new NotFoundException(`Match ${matchId} not found`);
    }

    await this.ductape.dbUpdate('matches', { id: matchId }, {
      $set: { status: 'disputed' },
    });

    return this.getMatch(matchId);
  }

  async cancelMatch(matchId: string, userId: string) {
    const match = (await this.ductape.dbFindOne('matches', { id: matchId })) as any;
    if (!match) {
      throw new NotFoundException(`Match ${matchId} not found`);
    }

    if (match.status === 'completed') {
      throw new ConflictException('Cannot cancel a completed match');
    }

    await this.ductape.dbUpdate('matches', { id: matchId }, {
      $set: { status: 'cancelled' },
    });

    // End live match if exists
    await this.ductape.dbUpdate('live_matches', { matchId }, {
      $set: { isLive: false },
    });

    return { success: true };
  }

  async getMatch(id: string) {
    const match = (await this.ductape.dbFindOne('matches', { id })) as any;
    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }

    const player1 = await this.usersService.findById(match.player1Id);
    const player2 = await this.usersService.findById(match.player2Id);

    return { ...match, player1, player2 };
  }

  async getMatches(options: {
    guildId?: string;
    status?: string;
    userId?: string;
    limit?: number;
    skip?: number;
  }) {
    const query: any = {};
    if (options.guildId) query.guildId = options.guildId;
    if (options.status) query.status = options.status;
    if (options.userId) {
      // Split $or query
      const [p1Matches, p2Matches] = await Promise.all([
        this.ductape.dbFindMany('matches', { ...query, player1Id: options.userId }),
        this.ductape.dbFindMany('matches', { ...query, player2Id: options.userId }),
      ]);
      const combined = [...p1Matches, ...p2Matches] as any[];
      const unique = Array.from(new Map(combined.map((m: any) => [m.id, m])).values());
      unique.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const limited = unique.slice(options.skip || 0, (options.skip || 0) + (options.limit || 20));

      return Promise.all(
        limited.map(async (match: any) => {
          const player1 = await this.usersService.findById(match.player1Id);
          const player2 = await this.usersService.findById(match.player2Id);
          return { ...match, player1, player2 };
        })
      );
    }

    const matches = await this.ductape.dbFindMany('matches', query, {
      limit: options.limit || 20,
      skip: options.skip || 0,
      sort: { createdAt: -1 },
    });

    return Promise.all(
      matches.map(async (match: any) => {
        const player1 = await this.usersService.findById(match.player1Id);
        const player2 = await this.usersService.findById(match.player2Id);
        return { ...match, player1, player2 };
      })
    );
  }

  async getUserMatchHistory(userId: string, limit: number = 10) {
    return this.getMatches({ userId, status: 'completed', limit });
  }

  // ==================== LIVE MATCHES ====================

  async getLiveMatches(guildId?: string) {
    const query: any = { isLive: true };

    const liveMatches = await this.ductape.dbFindMany('live_matches', query, {
      sort: { viewers: -1 },
    });

    return Promise.all(
      liveMatches.map(async (live: any) => {
        const match = await this.getMatch(live.matchId);
        if (guildId && match.guildId !== guildId) return null;
        return {
          ...live,
          player1: match.player1,
          player2: match.player2,
          guildId: match.guildId,
          editionId: match.editionId,
        };
      })
    ).then(results => results.filter(Boolean));
  }

  async updateLiveScore(matchId: string, score: { player1: number; player2: number }) {
    await this.ductape.dbUpdate('live_matches', { matchId }, {
      $set: { score },
    });

    return this.getLiveMatch(matchId);
  }

  async addViewer(matchId: string) {
    await this.ductape.dbUpdate('live_matches', { matchId }, {
      $inc: { viewers: 1 },
    });
  }

  async removeViewer(matchId: string) {
    await this.ductape.dbUpdate('live_matches', { matchId }, {
      $inc: { viewers: -1 },
    });
  }

  async getLiveMatch(matchId: string) {
    const live = (await this.ductape.dbFindOne('live_matches', { matchId })) as any;
    if (!live) return null;

    const match = await this.getMatch(matchId);
    return {
      ...live,
      player1: match.player1,
      player2: match.player2,
      guildId: match.guildId,
      editionId: match.editionId,
    };
  }

  // ==================== SPOTCHECKS (Disputes) ====================

  async createSpotcheck(dto: CreateSpotcheckDto) {
    const match = (await this.getMatch(dto.matchId)) as any;

    const spotcheckId = uuidv4();

    const spotcheck = {
      id: spotcheckId,
      matchId: dto.matchId,
      status: 'pending',
      evidence: [],
      player1Claim: dto.player1Claim,
      player2Claim: dto.player2Claim,
      createdAt: new Date(),
    };

    await this.ductape.dbInsert('spotchecks', spotcheck);

    // Mark match as disputed
    await this.ductape.dbUpdate('matches', { id: dto.matchId }, {
      $set: { status: 'disputed' },
    });

    // Notify players
    await this.socialService.createNotification(
      (match as any).player1Id,
      'match_update',
      'Spotcheck Triggered',
      `Your match is being spotchecked. Please provide evidence.`,
      { matchId: dto.matchId, spotcheckId },
    );
    await this.socialService.createNotification(
      (match as any).player2Id,
      'match_update',
      'Spotcheck Triggered',
      `Your match is being spotchecked. Please provide evidence.`,
      { matchId: dto.matchId, spotcheckId },
    );

    this.logger.log(`Created spotcheck ${spotcheckId} for match ${dto.matchId}`);
    return { ...spotcheck, match };
  }

  async addEvidence(spotcheckId: string, dto: AddEvidenceDto) {
    const spotcheck = (await this.ductape.dbFindOne('spotchecks', { id: spotcheckId })) as any;
    if (!spotcheck) {
      throw new NotFoundException(`Spotcheck ${spotcheckId} not found`);
    }

    const evidence = {
      type: dto.type,
      url: dto.url,
      uploadedBy: dto.uploadedBy,
      uploadedAt: new Date(),
    };

    await this.ductape.dbUpdate('spotchecks', { id: spotcheckId }, {
      $push: { evidence },
      $set: { status: 'reviewing' },
    });

    // Notify creator/reviewer
    if ((spotcheck as any).assignedTo) {
      await this.socialService.createNotification(
        (spotcheck as any).assignedTo,
        'match_update',
        'Spotcheck Evidence',
        `New evidence has been added to spotcheck.`,
        { spotcheckId, addedBy: dto.uploadedBy },
      );
    }

    return this.getSpotcheck(spotcheckId);
  }

  async resolveSpotcheck(spotcheckId: string, dto: ResolveSpotcheckDto) {
    const spotcheck = (await this.ductape.dbFindOne('spotchecks', { id: spotcheckId })) as any;
    if (!spotcheck) {
      throw new NotFoundException(`Spotcheck ${spotcheckId} not found`);
    }

    const resolution = {
      winnerId: dto.winnerId,
      finalScore: dto.finalScore,
      notes: dto.notes,
    };

    await this.ductape.dbUpdate('spotchecks', { id: spotcheckId }, {
      $set: {
        status: 'resolved',
        resolution,
        resolvedBy: dto.resolvedBy,
        resolvedAt: new Date(),
      },
    });

    // Update match with resolved result
    const match = (await this.ductape.dbFindOne('matches', { id: spotcheck.matchId })) as any;
    const loserId = dto.winnerId === match.player1Id ? match.player2Id : match.player1Id;

    await this.ductape.dbUpdate('matches', { id: spotcheck.matchId }, {
      $set: {
        status: 'completed',
        completedAt: new Date(),
        result: {
          winnerId: dto.winnerId,
          loserId,
          winnerScore: dto.finalScore.winner,
          loserScore: dto.finalScore.loser,
          duration: 0,
        },
      },
    });

    // Update stats and credits
    await this.usersService.updateUserStats(dto.winnerId, (match as any).guildId, {
      won: true,
      creditsWon: (match as any).creditPot,
    });

    await this.usersService.updateUserStats(loserId, (match as any).guildId, {
      won: false,
    });

    await this.usersService.updateCredits(dto.winnerId, {
      amount: (match as any).creditPot,
      type: 'rc',
      operation: 'add',
    });

    // Notify players of resolution
    await this.socialService.createNotification(
      (match as any).player1Id,
      'match_update',
      'Spotcheck Resolved',
      `Spotcheck for your match has been resolved.`,
      { matchId: (match as any).id, winnerId: dto.winnerId },
    );
    await this.socialService.createNotification(
      (match as any).player2Id,
      'match_update',
      'Spotcheck Resolved',
      `Spotcheck for your match has been resolved.`,
      { matchId: (match as any).id, winnerId: dto.winnerId },
    );

    this.logger.log(`Spotcheck ${spotcheckId} resolved - Winner: ${dto.winnerId}`);
    return this.getSpotcheck(spotcheckId);
  }

  async getSpotcheck(id: string) {
    const spotcheck = (await this.ductape.dbFindOne('spotchecks', { id })) as any;
    if (!spotcheck) {
      throw new NotFoundException(`Spotcheck ${id} not found`);
    }

    const match = await this.getMatch(spotcheck.matchId);
    return { ...spotcheck, match };
  }

  async getPendingSpotchecks(userId?: string) {
    const query: any = { status: { $in: ['pending', 'reviewing'] } };
    if (userId) {
      query.assignedTo = userId;
    }

    const spotchecks = await this.ductape.dbFindMany('spotchecks', query, {
      sort: { createdAt: -1 },
    });

    return Promise.all(
      spotchecks.map(async (s: any) => {
        const match = await this.getMatch(s.matchId);
        return { ...s, match };
      })
    );
  }

  async assignSpotcheck(spotcheckId: string, assignedTo: string) {
    await this.ductape.dbUpdate('spotchecks', { id: spotcheckId }, {
      $set: { assignedTo, status: 'reviewing' },
    });

    return this.getSpotcheck(spotcheckId);
  }

  // ==================== STORAGE helpers ====================

  async getSpotcheckEvidenceUploadUrl(spotcheckId: string, fileName: string) {
    const objectKey = `evidence/${spotcheckId}-${Date.now()}-${fileName}`;
    const uploadUrl = await this.ductape.getSignedUrl(objectKey, 3600, 'write');
    const publicUrl = `https://storage.ductape.app/${this.ductape.productTag}/${objectKey}`;

    return { uploadUrl, publicUrl };
  }

  async getSignedEvidenceUrl(objectKey: string) {
    return this.ductape.getSignedUrl(objectKey, 3600, 'read');
  }
}

