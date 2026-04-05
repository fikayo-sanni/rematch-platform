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
var CompetitionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompetitionsService = void 0;
const common_1 = require("@nestjs/common");
const ductape_config_1 = require("../../config/ductape.config");
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
let CompetitionsService = CompetitionsService_1 = class CompetitionsService {
    ductape;
    usersService;
    logger = new common_1.Logger(CompetitionsService_1.name);
    constructor(ductape, usersService) {
        this.ductape = ductape;
        this.usersService = usersService;
    }
    async createRun(dto) {
        const runId = (0, uuid_1.v4)();
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
    async joinRun(runId, userId) {
        const run = await this.ductape.dbFindOne('runs', { id: runId });
        if (!run) {
            throw new common_1.NotFoundException(`Run ${runId} not found`);
        }
        if (run.participantIds.includes(userId)) {
            throw new common_1.ConflictException('Already joined this tournament');
        }
        if (run.participantCount >= run.maxParticipants) {
            throw new common_1.ConflictException('Tournament is full');
        }
        if (new Date(run.startsAt) < new Date()) {
            throw new common_1.ConflictException('Tournament has already started');
        }
        await this.ductape.dbUpdate('runs', { id: runId }, {
            $push: { participantIds: userId },
            $inc: { participantCount: 1 },
        });
        await this.ductape.dbInsert('notifications', {
            id: (0, uuid_1.v4)(),
            userId,
            type: 'tournament_update',
            title: 'Tournament Joined',
            message: `You've joined ${run.name}!`,
            isRead: false,
            data: { runId },
            createdAt: new Date(),
        });
        return this.getRun(runId);
    }
    async leaveRun(runId, userId) {
        const run = await this.ductape.dbFindOne('runs', { id: runId });
        if (!run) {
            throw new common_1.NotFoundException(`Run ${runId} not found`);
        }
        if (!run.participantIds.includes(userId)) {
            throw new common_1.ConflictException('Not a participant in this tournament');
        }
        if (run.isActive) {
            throw new common_1.ConflictException('Cannot leave an active tournament');
        }
        await this.ductape.dbUpdate('runs', { id: runId }, {
            $pull: { participantIds: userId },
            $inc: { participantCount: -1 },
        });
        return { success: true };
    }
    async startRun(runId) {
        const run = await this.ductape.dbFindOne('runs', { id: runId });
        if (!run) {
            throw new common_1.NotFoundException(`Run ${runId} not found`);
        }
        await this.ductape.dbUpdate('runs', { id: runId }, {
            $set: { isActive: true },
        });
        for (const participantId of run.participantIds) {
            await this.ductape.dbInsert('notifications', {
                id: (0, uuid_1.v4)(),
                userId: participantId,
                type: 'tournament_update',
                title: 'Tournament Started!',
                message: `${run.name} has begun!`,
                isRead: false,
                data: { runId },
                createdAt: new Date(),
            });
        }
        return this.getRun(runId);
    }
    async endRun(runId, winnerId) {
        const run = await this.ductape.dbFindOne('runs', { id: runId });
        if (!run) {
            throw new common_1.NotFoundException(`Run ${runId} not found`);
        }
        await this.ductape.dbUpdate('runs', { id: runId }, {
            $set: { isActive: false, winnerId },
        });
        await this.usersService.updateCredits(winnerId, {
            amount: run.creditPot,
            type: 'rc',
            operation: 'add',
        });
        await this.usersService.updateUserStats(winnerId, run.guildId, {
            tournamentWin: true,
            creditsEarned: run.creditPot,
        });
        await this.ductape.dbInsert('notifications', {
            id: (0, uuid_1.v4)(),
            userId: winnerId,
            type: 'tournament_update',
            title: 'Tournament Victory!',
            message: `You won ${run.name} and ${run.creditPot} credits!`,
            isRead: false,
            data: { runId, credits: run.creditPot },
            createdAt: new Date(),
        });
        return this.getRun(runId);
    }
    async getRun(id) {
        const run = await this.ductape.dbFindOne('runs', { id });
        if (!run) {
            throw new common_1.NotFoundException(`Run ${id} not found`);
        }
        const participants = await Promise.all(run.participantIds.map((userId) => this.usersService.findById(userId)));
        const winner = run.winnerId ? await this.usersService.findById(run.winnerId) : null;
        return { ...run, participants, winner };
    }
    async getRuns(options) {
        const query = {};
        if (options.guildId)
            query.guildId = options.guildId;
        if (options.type)
            query.type = options.type;
        if (options.isActive !== undefined)
            query.isActive = options.isActive;
        const runs = await this.ductape.dbFindMany('runs', query, {
            limit: options.limit || 20,
            skip: options.skip || 0,
            sort: { startsAt: -1 },
        });
        return Promise.all(runs.map((run) => this.getRun(run.id)));
    }
    async getActiveRuns(guildId) {
        return this.getRuns({ guildId, isActive: true });
    }
    async getUpcomingRuns(guildId) {
        const query = { isActive: false, winnerId: null };
        if (guildId)
            query.guildId = guildId;
        const runs = await this.ductape.dbFindMany('runs', query, {
            sort: { startsAt: 1 },
        });
        const now = new Date();
        const upcomingRuns = runs.filter((r) => new Date(r.startsAt) > now);
        return Promise.all(upcomingRuns.map((run) => this.getRun(run.id)));
    }
    async getUserRuns(userId) {
        const runs = await this.ductape.dbFindMany('runs', {
            participantIds: userId,
        }, { sort: { startsAt: -1 } });
        return Promise.all(runs.map((run) => this.getRun(run.id)));
    }
    async createLeague(dto) {
        const leagueId = (0, uuid_1.v4)();
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
    async joinLeague(leagueId, userId) {
        const league = await this.ductape.dbFindOne('leagues', { id: leagueId });
        if (!league) {
            throw new common_1.NotFoundException(`League ${leagueId} not found`);
        }
        if (league.participantIds.includes(userId)) {
            throw new common_1.ConflictException('Already joined this league');
        }
        if (league.participantCount >= league.maxParticipants) {
            throw new common_1.ConflictException('League is full');
        }
        if (league.status !== 'upcoming') {
            throw new common_1.ConflictException('Cannot join a league that has already started');
        }
        await this.usersService.updateCredits(userId, {
            amount: league.entryFee,
            type: 'rc',
            operation: 'subtract',
        });
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
        await this.ductape.dbInsert('notifications', {
            id: (0, uuid_1.v4)(),
            userId,
            type: 'league_update',
            title: 'League Joined',
            message: `You've joined ${league.name}!`,
            isRead: false,
            data: { leagueId },
            createdAt: new Date(),
        });
        return this.getLeague(leagueId);
    }
    async startLeague(leagueId) {
        const league = await this.ductape.dbFindOne('leagues', { id: leagueId });
        if (!league) {
            throw new common_1.NotFoundException(`League ${leagueId} not found`);
        }
        await this.ductape.dbUpdate('leagues', { id: leagueId }, {
            $set: { status: 'active' },
        });
        for (const participantId of league.participantIds) {
            await this.ductape.dbInsert('notifications', {
                id: (0, uuid_1.v4)(),
                userId: participantId,
                type: 'league_update',
                title: 'League Started!',
                message: `${league.name} has begun!`,
                isRead: false,
                data: { leagueId },
                createdAt: new Date(),
            });
        }
        return this.getLeague(leagueId);
    }
    async updateStandings(leagueId, dto) {
        const league = await this.ductape.dbFindOne('leagues', { id: leagueId });
        if (!league) {
            throw new common_1.NotFoundException(`League ${leagueId} not found`);
        }
        const standings = league.standings;
        const winnerIdx = standings.findIndex((s) => s.userId === dto.winnerId);
        if (winnerIdx !== -1) {
            if (dto.isDraw) {
                standings[winnerIdx].draws += 1;
                standings[winnerIdx].points += 1;
            }
            else {
                standings[winnerIdx].wins += 1;
                standings[winnerIdx].points += 3;
            }
            standings[winnerIdx].played += 1;
            standings[winnerIdx].goalsFor += dto.winnerGoals;
            standings[winnerIdx].goalsAgainst += dto.loserGoals;
        }
        const loserIdx = standings.findIndex((s) => s.userId === dto.loserId);
        if (loserIdx !== -1) {
            if (dto.isDraw) {
                standings[loserIdx].draws += 1;
                standings[loserIdx].points += 1;
            }
            else {
                standings[loserIdx].losses += 1;
            }
            standings[loserIdx].played += 1;
            standings[loserIdx].goalsFor += dto.loserGoals;
            standings[loserIdx].goalsAgainst += dto.winnerGoals;
        }
        standings.sort((a, b) => {
            if (b.points !== a.points)
                return b.points - a.points;
            const aGD = a.goalsFor - a.goalsAgainst;
            const bGD = b.goalsFor - b.goalsAgainst;
            return bGD - aGD;
        });
        await this.ductape.dbUpdate('leagues', { id: leagueId }, {
            $set: { standings },
        });
        return this.getLeague(leagueId);
    }
    async endLeague(leagueId) {
        const league = await this.ductape.dbFindOne('leagues', { id: leagueId });
        if (!league) {
            throw new common_1.NotFoundException(`League ${leagueId} not found`);
        }
        const winnerId = league.standings[0]?.userId;
        await this.ductape.dbUpdate('leagues', { id: leagueId }, {
            $set: { status: 'completed', winnerId },
        });
        if (winnerId) {
            await this.usersService.updateCredits(winnerId, {
                amount: league.prizePool,
                type: 'rc',
                operation: 'add',
            });
            await this.ductape.dbInsert('notifications', {
                id: (0, uuid_1.v4)(),
                userId: winnerId,
                type: 'league_update',
                title: 'League Victory!',
                message: `You won ${league.name} and ${league.prizePool} credits!`,
                isRead: false,
                data: { leagueId, credits: league.prizePool },
                createdAt: new Date(),
            });
        }
        return this.getLeague(leagueId);
    }
    async getLeague(id) {
        const league = await this.ductape.dbFindOne('leagues', { id });
        if (!league) {
            throw new common_1.NotFoundException(`League ${id} not found`);
        }
        const participants = await Promise.all(league.participantIds.map((userId) => this.usersService.findById(userId)));
        const standings = await Promise.all(league.standings.map(async (standing) => {
            const user = await this.usersService.findById(standing.userId);
            return { ...standing, user };
        }));
        const winner = league.winnerId ? await this.usersService.findById(league.winnerId) : null;
        return { ...league, participants, standings, winner };
    }
    async getLeagues(options) {
        const query = {};
        if (options.guildId)
            query.guildId = options.guildId;
        if (options.status)
            query.status = options.status;
        if (options.type)
            query.type = options.type;
        const leagues = await this.ductape.dbFindMany('leagues', query, {
            limit: options.limit || 20,
            skip: options.skip || 0,
            sort: { startsAt: -1 },
        });
        return Promise.all(leagues.map((league) => this.getLeague(league.id)));
    }
    async getUserLeagues(userId) {
        const leagues = await this.ductape.dbFindMany('leagues', {
            participantIds: userId,
        }, { sort: { startsAt: -1 } });
        return Promise.all(leagues.map((league) => this.getLeague(league.id)));
    }
};
exports.CompetitionsService = CompetitionsService;
exports.CompetitionsService = CompetitionsService = CompetitionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ductape_config_1.DuctapeService,
        users_service_1.UsersService])
], CompetitionsService);
//# sourceMappingURL=competitions.service.js.map