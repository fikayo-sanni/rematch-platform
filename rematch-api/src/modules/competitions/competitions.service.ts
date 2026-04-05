import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { DuctapeService } from '../../config/ductape.config';
import { UsersService } from '../users/users.service';
import { CreateRunDto, CreateLeagueDto, UpdateStandingsDto } from './dto/competition.dto';
import { SocialService } from '../social/social.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompetitionsService {
  private readonly logger = new Logger(CompetitionsService.name);

  constructor(
    private readonly ductape: DuctapeService,
    private readonly usersService: UsersService,
    private readonly socialService: SocialService,
  ) {}

  // ==================== RUNS (Tournaments) ====================

  async createRun(dto: CreateRunDto) {
    const runId = uuidv4();

    const run = {
      id: runId,
      name: dto.name,
      type: dto.type,
      guildId: dto.guildId,
      editionId: dto.editionId,
      creditPot: dto.creditPot,
      participantCount: 0,
      maxParticipants: dto.maxParticipants,
      participantIds: [],
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      isActive: false,
      winnerId: null,
      createdAt: new Date(),
    };

    await this.ductape.dbInsert('runs', run);

    this.logger.log(`Created run ${runId}: ${dto.name}`);
    return run;
  }

  async joinRun(runId: string, userId: string) {
    const run = (await this.ductape.dbFindOne('runs', { id: runId })) as any;
    if (!run) {
      throw new NotFoundException(`Run ${runId} not found`);
    }

    if ((run as any).participantIds.includes(userId)) {
      throw new ConflictException('Already joined this tournament');
    }

    if ((run as any).participantCount >= (run as any).maxParticipants) {
      throw new ConflictException('Tournament is full');
    }

    if (new Date((run as any).startsAt) < new Date()) {
      throw new ConflictException('Tournament has already started');
    }

    await this.ductape.dbUpdate('runs', { id: runId }, {
      $push: { participantIds: userId },
      $inc: { participantCount: 1 },
    });

    // Create notification
    await this.socialService.createNotification(
      userId,
      'tournament_update',
      'Tournament Joined',
      `You've joined ${run.name}!`,
      { runId },
    );

    return this.getRun(runId);
  }

  async leaveRun(runId: string, userId: string) {
    const run = await this.ductape.dbFindOne('runs', { id: runId });
    if (!run) {
      throw new NotFoundException(`Run ${runId} not found`);
    }

    if (!(run as any).participantIds.includes(userId)) {
      throw new ConflictException('Not a participant in this tournament');
    }

    if ((run as any).isActive) {
      throw new ConflictException('Cannot leave an active tournament');
    }

    await this.ductape.dbUpdate('runs', { id: runId }, {
      $pull: { participantIds: userId },
      $inc: { participantCount: -1 },
    });

    return { success: true };
  }

  async startRun(runId: string) {
    const run = (await this.getRun(runId)) as any;
    if (!run) {
      throw new NotFoundException(`Run ${runId} not found`);
    }

    await this.ductape.dbUpdate('runs', { id: runId }, {
      $set: { isActive: true },
    });

    // Notify all participants
    for (const participantId of run.participantIds) {
      await this.socialService.createNotification(
        participantId,
        'tournament_update',
        'Tournament Started!',
        `${run.name} has begun!`,
        { runId },
      );
    }

    return this.getRun(runId);
  }

  async endRun(runId: string, winnerId: string) {
    const run = (await this.getRun(runId)) as any;
    if (!run) {
      throw new NotFoundException(`Run ${runId} not found`);
    }

    await this.ductape.dbUpdate('runs', { id: runId }, {
      $set: { isActive: false, winnerId },
    });

    // Award credits to winner
    await this.usersService.updateCredits(winnerId, {
      amount: run.creditPot,
      type: 'rc',
      operation: 'add',
    });

    // Update winner stats
    await this.usersService.updateUserStats(winnerId, (run as any).guildId, {
      won: true,
      creditsWon: (run as any).creditPot,
    });

    // Notify winner
    await this.socialService.createNotification(
      winnerId,
      'tournament_update',
      'Tournament Victory!',
      `You won ${run.name} and ${run.creditPot} credits!`,
      { runId, credits: run.creditPot },
    );

    return this.getRun(runId);
  }

  async getRun(id: string) {
    const run = (await this.ductape.dbFindOne('runs', { id })) as any;
    if (!run) {
      throw new NotFoundException(`Run ${id} not found`);
    }

    const participants = await Promise.all(
      run.participantIds.map((userId: string) => this.usersService.findById(userId))
    );

    const winner = run.winnerId ? await this.usersService.findById(run.winnerId) : null;

    return { ...run, participants, winner };
  }

  async getRuns(options: {
    guildId?: string;
    type?: string;
    isActive?: boolean;
    limit?: number;
    skip?: number;
  }) {
    const query: any = {};
    if (options.guildId) query.guildId = options.guildId;
    if (options.type) query.type = options.type;
    if (options.isActive !== undefined) query.isActive = options.isActive;

    const runs = await this.ductape.dbFindMany('runs', query, {
      limit: options.limit || 20,
      skip: options.skip || 0,
      sort: { startsAt: -1 },
    });

    return Promise.all(runs.map((run: any) => this.getRun(run.id)));
  }

  async getActiveRuns(guildId?: string) {
    return this.getRuns({ guildId, isActive: true });
  }

  async getUpcomingRuns(guildId?: string) {
    const query: any = { isActive: false, winnerId: null };
    if (guildId) query.guildId = guildId;

    const runs = await this.ductape.dbFindMany('runs', query, {
      sort: { startsAt: 1 },
    });

    // Filter to only future runs
    const now = new Date();
    const upcomingRuns = runs.filter((r: any) => new Date(r.startsAt) > now);

    return Promise.all(upcomingRuns.map((run: any) => this.getRun(run.id)));
  }

  async getUserRuns(userId: string) {
    const runs = await this.ductape.dbFindMany('runs', {
      participantIds: userId,
    }, { sort: { startsAt: -1 } });

    return Promise.all(runs.map((run: any) => this.getRun(run.id)));
  }

  // ==================== LEAGUES ====================

  async createLeague(dto: CreateLeagueDto) {
    const leagueId = uuidv4();

    const league = {
      id: leagueId,
      name: dto.name,
      type: dto.type,
      guildId: dto.guildId,
      editionId: dto.editionId,
      status: 'upcoming',
      entryFee: dto.entryFee,
      prizePool: dto.prizePool,
      participantCount: 0,
      maxParticipants: dto.maxParticipants,
      matchesPerPlayer: dto.matchesPerPlayer,
      participantIds: [],
      standings: [],
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      winnerId: null,
      createdAt: new Date(),
    };

    await this.ductape.dbInsert('leagues', league);

    this.logger.log(`Created league ${leagueId}: ${dto.name}`);
    return league;
  }

  async joinLeague(leagueId: string, userId: string) {
    const league = (await this.ductape.dbFindOne('leagues', { id: leagueId })) as any;
    if (!league) {
      throw new NotFoundException(`League ${leagueId} not found`);
    }

    if (league.participantIds.includes(userId)) {
      throw new ConflictException('Already joined this league');
    }

    if (league.participantCount >= league.maxParticipants) {
      throw new ConflictException('League is full');
    }

    if (league.status !== 'upcoming') {
      throw new ConflictException('Cannot join a league that has already started');
    }

    // Deduct entry fee
    await this.usersService.updateCredits(userId, {
      amount: league.entryFee,
      type: 'rc',
      operation: 'subtract',
    });

    // Create standing entry
    const standing = {
      userId,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    };

    await this.ductape.dbUpdate('leagues', { id: leagueId }, {
      $push: { participantIds: userId, standings: standing },
      $inc: { participantCount: 1 },
    });

    // Create notification
    await this.socialService.createNotification(
      userId,
      'league_update',
      'League Joined',
      `You've joined ${league.name}!`,
      { leagueId },
    );

    return this.getLeague(leagueId);
  }

  async startLeague(leagueId: string) {
    const league = (await this.getLeague(leagueId)) as any;
    if (!league) {
      throw new NotFoundException(`League ${leagueId} not found`);
    }

    await this.ductape.dbUpdate('leagues', { id: leagueId }, {
      $set: { status: 'active' },
    });

    // Notify all participants
    for (const participantId of league.participantIds) {
      await this.socialService.createNotification(
        participantId,
        'league_update',
        'League Started!',
        `${league.name} has begun!`,
        { leagueId },
      );
    }

    return this.getLeague(leagueId);
  }

  async updateStandings(leagueId: string, dto: UpdateStandingsDto) {
    const league = (await this.getLeague(leagueId)) as any;
    if (!league) {
      throw new NotFoundException(`League ${leagueId} not found`);
    }

    const standings = league.standings;

    // Update winner standing
    const winnerIdx = standings.findIndex((s: any) => s.userId === dto.winnerId);
    if (winnerIdx !== -1) {
      if (dto.isDraw) {
        standings[winnerIdx].draws += 1;
        standings[winnerIdx].points += 1;
      } else {
        standings[winnerIdx].wins += 1;
        standings[winnerIdx].points += 3;
      }
      standings[winnerIdx].played += 1;
      standings[winnerIdx].goalsFor += dto.winnerGoals;
      standings[winnerIdx].goalsAgainst += dto.loserGoals;
    }

    // Update loser standing
    const loserIdx = standings.findIndex((s: any) => s.userId === dto.loserId);
    if (loserIdx !== -1) {
      if (dto.isDraw) {
        standings[loserIdx].draws += 1;
        standings[loserIdx].points += 1;
      } else {
        standings[loserIdx].losses += 1;
      }
      standings[loserIdx].played += 1;
      standings[loserIdx].goalsFor += dto.loserGoals;
      standings[loserIdx].goalsAgainst += dto.winnerGoals;
    }

    // Sort standings by points, then goal difference
    standings.sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points;
      const aGD = a.goalsFor - a.goalsAgainst;
      const bGD = b.goalsFor - b.goalsAgainst;
      return bGD - aGD;
    });

    await this.ductape.dbUpdate('leagues', { id: leagueId }, {
      $set: { standings },
    });

    return this.getLeague(leagueId);
  }

  async endLeague(leagueId: string) {
    const league = (await this.getLeague(leagueId)) as any;
    if (!league) {
      throw new NotFoundException(`League ${leagueId} not found`);
    }

    // Winner is top of standings
    const winnerId = league.standings[0]?.userId;

    await this.ductape.dbUpdate('leagues', { id: leagueId }, {
      $set: { status: 'completed', winnerId },
    });

    if (winnerId) {
      // Award prize pool
      await this.usersService.updateCredits(winnerId, {
        amount: league.prizePool,
        type: 'rc',
        operation: 'add',
      });

      // Notify winner
      await this.socialService.createNotification(
        winnerId,
        'league_update',
        'League Victory!',
        `You won ${league.name} and ${league.prizePool} credits!`,
        { leagueId, credits: league.prizePool },
      );
    }

    return this.getLeague(leagueId);
  }

  async getLeague(id: string) {
    const league = (await this.ductape.dbFindOne('leagues', { id })) as any;
    if (!league) {
      throw new NotFoundException(`League ${id} not found`);
    }

    const participants = await Promise.all(
      league.participantIds.map((userId: string) => this.usersService.findById(userId))
    );

    // Enrich standings with user data
    const standings = await Promise.all(
      league.standings.map(async (standing: any) => {
        const user = await this.usersService.findById(standing.userId);
        return { ...standing, user };
      })
    );

    const winner = league.winnerId ? await this.usersService.findById(league.winnerId) : null;

    return { ...league, participants, standings, winner };
  }

  async getLeagues(options: {
    guildId?: string;
    status?: string;
    type?: string;
    limit?: number;
    skip?: number;
  }) {
    const query: any = {};
    if (options.guildId) query.guildId = options.guildId;
    if (options.status) query.status = options.status;
    if (options.type) query.type = options.type;

    const leagues = await this.ductape.dbFindMany('leagues', query, {
      limit: options.limit || 20,
      skip: options.skip || 0,
      sort: { startsAt: -1 },
    });

    return Promise.all(leagues.map((league: any) => this.getLeague(league.id)));
  }

  async getUserLeagues(userId: string) {
    const leagues = await this.ductape.dbFindMany('leagues', {
      participantIds: userId,
    }, { sort: { startsAt: -1 } });

    return Promise.all(leagues.map((league: any) => this.getLeague(league.id)));
  }
}
