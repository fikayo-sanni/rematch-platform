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
var MatchesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const ductape_config_1 = require("../../config/ductape.config");
const graph_setup_service_1 = require("../../database/graph-setup.service");
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
let MatchesService = MatchesService_1 = class MatchesService {
    ductape;
    graphService;
    usersService;
    logger = new common_1.Logger(MatchesService_1.name);
    constructor(ductape, graphService, usersService) {
        this.ductape = ductape;
        this.graphService = graphService;
        this.usersService = usersService;
    }
    async createPull(dto) {
        const pullId = (0, uuid_1.v4)();
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
    async acceptPull(pullId, dto) {
        const pull = await this.ductape.dbFindOne('pulls', { id: pullId });
        if (!pull) {
            throw new common_1.NotFoundException(`Pull ${pullId} not found`);
        }
        if (pull.status !== 'pending') {
            throw new common_1.ConflictException(`Pull is already ${pull.status}`);
        }
        if (new Date(pull.expiresAt) < new Date()) {
            await this.ductape.dbUpdate('pulls', { id: pullId }, { $set: { status: 'expired' } });
            throw new common_1.ConflictException('Pull has expired');
        }
        await this.ductape.dbUpdate('pulls', { id: pullId }, {
            $set: { opponentId: dto.opponentId, status: 'accepted' },
        });
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
    async declinePull(pullId, opponentId) {
        const pull = await this.ductape.dbFindOne('pulls', { id: pullId });
        if (!pull) {
            throw new common_1.NotFoundException(`Pull ${pullId} not found`);
        }
        await this.ductape.dbUpdate('pulls', { id: pullId }, {
            $set: { status: 'declined', opponentId },
        });
        return { success: true };
    }
    async getPull(id) {
        const pull = await this.ductape.dbFindOne('pulls', { id });
        if (!pull) {
            throw new common_1.NotFoundException(`Pull ${id} not found`);
        }
        const initiator = await this.usersService.findById(pull.initiatorId);
        const opponent = pull.opponentId ? await this.usersService.findById(pull.opponentId) : null;
        return { ...pull, initiator, opponent };
    }
    async getPendingPulls(guildId, editionId) {
        const query = { guildId, status: 'pending' };
        if (editionId)
            query.editionId = editionId;
        const pulls = await this.ductape.dbFindMany('pulls', query, {
            sort: { createdAt: -1 },
        });
        const now = new Date();
        const validPulls = pulls.filter((p) => new Date(p.expiresAt) > now);
        return Promise.all(validPulls.map(async (pull) => {
            const initiator = await this.usersService.findById(pull.initiatorId);
            return { ...pull, initiator };
        }));
    }
    async getUserPulls(userId, status) {
        const query = {
            $or: [{ initiatorId: userId }, { opponentId: userId }],
        };
        if (status)
            query.status = status;
        const pulls = await this.ductape.dbFindMany('pulls', query, {
            sort: { createdAt: -1 },
        });
        return Promise.all(pulls.map(async (pull) => {
            const initiator = await this.usersService.findById(pull.initiatorId);
            const opponent = pull.opponentId ? await this.usersService.findById(pull.opponentId) : null;
            return { ...pull, initiator, opponent };
        }));
    }
    async createCall(dto) {
        const callId = (0, uuid_1.v4)();
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
        await this.ductape.dbInsert('notifications', {
            id: (0, uuid_1.v4)(),
            userId: dto.challengedId,
            type: 'challenge_received',
            title: 'New Challenge!',
            message: `You've been challenged! ${dto.creditPot} credits on the line.`,
            isRead: false,
            data: { callId, challengerId: dto.challengerId },
            createdAt: new Date(),
        });
        const challenger = await this.usersService.findById(dto.challengerId);
        const challenged = await this.usersService.findById(dto.challengedId);
        this.logger.log(`Created call ${callId}: ${dto.challengerId} vs ${dto.challengedId}`);
        return { ...call, challenger, challenged };
    }
    async acceptCall(callId) {
        const call = await this.ductape.dbFindOne('calls', { id: callId });
        if (!call) {
            throw new common_1.NotFoundException(`Call ${callId} not found`);
        }
        if (call.status !== 'pending') {
            throw new common_1.ConflictException(`Call is already ${call.status}`);
        }
        if (new Date(call.expiresAt) < new Date()) {
            await this.ductape.dbUpdate('calls', { id: callId }, { $set: { status: 'expired' } });
            throw new common_1.ConflictException('Challenge has expired');
        }
        await this.ductape.dbUpdate('calls', { id: callId }, { $set: { status: 'accepted' } });
        const match = await this.createMatch({
            type: 'call',
            guildId: call.guildId,
            editionId: call.editionId,
            player1Id: call.challengerId,
            player2Id: call.challengedId,
            creditPot: call.creditPot,
            context: { type: 'challenge', id: callId, name: 'Challenge Match' },
        });
        await this.ductape.dbInsert('notifications', {
            id: (0, uuid_1.v4)(),
            userId: call.challengerId,
            type: 'challenge_accepted',
            title: 'Challenge Accepted!',
            message: 'Your challenge has been accepted. Get ready!',
            isRead: false,
            data: { callId, matchId: match.id },
            createdAt: new Date(),
        });
        return match;
    }
    async declineCall(callId) {
        const call = await this.ductape.dbFindOne('calls', { id: callId });
        if (!call) {
            throw new common_1.NotFoundException(`Call ${callId} not found`);
        }
        await this.ductape.dbUpdate('calls', { id: callId }, { $set: { status: 'declined' } });
        return { success: true };
    }
    async getCall(id) {
        const call = await this.ductape.dbFindOne('calls', { id });
        if (!call) {
            throw new common_1.NotFoundException(`Call ${id} not found`);
        }
        const challenger = await this.usersService.findById(call.challengerId);
        const challenged = await this.usersService.findById(call.challengedId);
        return { ...call, challenger, challenged };
    }
    async getPendingCalls(guildId, status) {
        const query = { guildId };
        if (status)
            query.status = status;
        else
            query.status = 'pending';
        const calls = await this.ductape.dbFindMany('calls', query, {
            sort: { createdAt: -1 },
        });
        const now = new Date();
        const validCalls = calls.filter((c) => c.status !== 'pending' || new Date(c.expiresAt) > now);
        return Promise.all(validCalls.map(async (call) => {
            const challenger = await this.usersService.findById(call.challengerId);
            const challenged = await this.usersService.findById(call.challengedId);
            return { ...call, challenger, challenged };
        }));
    }
    async getUserCalls(userId, type) {
        let query;
        if (type === 'sent') {
            query = { challengerId: userId };
        }
        else if (type === 'received') {
            query = { challengedId: userId };
        }
        else {
            query = { $or: [{ challengerId: userId }, { challengedId: userId }] };
        }
        const calls = await this.ductape.dbFindMany('calls', query, {
            sort: { createdAt: -1 },
        });
        return Promise.all(calls.map(async (call) => {
            const challenger = await this.usersService.findById(call.challengerId);
            const challenged = await this.usersService.findById(call.challengedId);
            return { ...call, challenger, challenged };
        }));
    }
    async createMatch(dto) {
        const matchId = (0, uuid_1.v4)();
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
    async startMatch(matchId) {
        const match = await this.ductape.dbFindOne('matches', { id: matchId });
        if (!match) {
            throw new common_1.NotFoundException(`Match ${matchId} not found`);
        }
        if (match.status !== 'accepted') {
            throw new common_1.ConflictException(`Match cannot be started - status is ${match.status}`);
        }
        await this.ductape.dbUpdate('matches', { id: matchId }, {
            $set: { status: 'in_progress', startedAt: new Date() },
        });
        await this.ductape.dbInsert('live_matches', {
            id: (0, uuid_1.v4)(),
            matchId,
            score: { player1: 0, player2: 0 },
            viewers: 0,
            duration: '00:00',
            startedAt: new Date(),
            isLive: true,
        });
        return this.getMatch(matchId);
    }
    async submitResult(matchId, dto) {
        const match = await this.ductape.dbFindOne('matches', { id: matchId });
        if (!match) {
            throw new common_1.NotFoundException(`Match ${matchId} not found`);
        }
        if (match.status !== 'in_progress') {
            throw new common_1.ConflictException(`Match is not in progress`);
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
        await this.ductape.dbUpdate('live_matches', { matchId }, {
            $set: { isLive: false },
        });
        await this.usersService.updateUserStats(dto.winnerId, match.guildId, {
            won: true,
            playTime: dto.duration,
            creditsEarned: match.creditPot,
        });
        await this.usersService.updateUserStats(loserId, match.guildId, {
            won: false,
            playTime: dto.duration,
        });
        await this.usersService.updateCredits(dto.winnerId, {
            amount: match.creditPot,
            type: 'rc',
            operation: 'add',
        });
        await this.graphService.recordMatch(matchId, match.player1Id, match.player2Id, dto.winnerId, match.guildId);
        await this.ductape.dbInsert('notifications', {
            id: (0, uuid_1.v4)(),
            userId: dto.winnerId,
            type: 'match_result',
            title: 'Victory!',
            message: `You won ${match.creditPot} credits!`,
            isRead: false,
            data: { matchId, result: 'win', credits: match.creditPot },
            createdAt: new Date(),
        });
        await this.ductape.dbInsert('notifications', {
            id: (0, uuid_1.v4)(),
            userId: loserId,
            type: 'match_result',
            title: 'Defeat',
            message: `Better luck next time!`,
            isRead: false,
            data: { matchId, result: 'loss' },
            createdAt: new Date(),
        });
        this.logger.log(`Match ${matchId} completed - Winner: ${dto.winnerId}`);
        return this.getMatch(matchId);
    }
    async disputeMatch(matchId) {
        const match = await this.ductape.dbFindOne('matches', { id: matchId });
        if (!match) {
            throw new common_1.NotFoundException(`Match ${matchId} not found`);
        }
        await this.ductape.dbUpdate('matches', { id: matchId }, {
            $set: { status: 'disputed' },
        });
        return this.getMatch(matchId);
    }
    async cancelMatch(matchId) {
        const match = await this.ductape.dbFindOne('matches', { id: matchId });
        if (!match) {
            throw new common_1.NotFoundException(`Match ${matchId} not found`);
        }
        if (match.status === 'completed') {
            throw new common_1.ConflictException('Cannot cancel a completed match');
        }
        await this.ductape.dbUpdate('matches', { id: matchId }, {
            $set: { status: 'cancelled' },
        });
        await this.ductape.dbUpdate('live_matches', { matchId }, {
            $set: { isLive: false },
        });
        return { success: true };
    }
    async getMatch(id) {
        const match = await this.ductape.dbFindOne('matches', { id });
        if (!match) {
            throw new common_1.NotFoundException(`Match ${id} not found`);
        }
        const player1 = await this.usersService.findById(match.player1Id);
        const player2 = await this.usersService.findById(match.player2Id);
        return { ...match, player1, player2 };
    }
    async getMatches(options) {
        const query = {};
        if (options.guildId)
            query.guildId = options.guildId;
        if (options.status)
            query.status = options.status;
        if (options.userId) {
            query.$or = [{ player1Id: options.userId }, { player2Id: options.userId }];
        }
        const matches = await this.ductape.dbFindMany('matches', query, {
            limit: options.limit || 20,
            skip: options.skip || 0,
            sort: { createdAt: -1 },
        });
        return Promise.all(matches.map(async (match) => {
            const player1 = await this.usersService.findById(match.player1Id);
            const player2 = await this.usersService.findById(match.player2Id);
            return { ...match, player1, player2 };
        }));
    }
    async getUserMatchHistory(userId, limit = 10) {
        return this.getMatches({ userId, status: 'completed', limit });
    }
    async getLiveMatches(guildId) {
        const query = { isLive: true };
        const liveMatches = await this.ductape.dbFindMany('live_matches', query, {
            sort: { viewers: -1 },
        });
        return Promise.all(liveMatches.map(async (live) => {
            const match = await this.getMatch(live.matchId);
            if (guildId && match.guildId !== guildId)
                return null;
            return {
                ...live,
                player1: match.player1,
                player2: match.player2,
                guildId: match.guildId,
                editionId: match.editionId,
            };
        })).then(results => results.filter(Boolean));
    }
    async updateLiveScore(matchId, score) {
        await this.ductape.dbUpdate('live_matches', { matchId }, {
            $set: { score },
        });
        return this.getLiveMatch(matchId);
    }
    async addViewer(matchId) {
        await this.ductape.dbUpdate('live_matches', { matchId }, {
            $inc: { viewers: 1 },
        });
    }
    async removeViewer(matchId) {
        await this.ductape.dbUpdate('live_matches', { matchId }, {
            $inc: { viewers: -1 },
        });
    }
    async getLiveMatch(matchId) {
        const live = await this.ductape.dbFindOne('live_matches', { matchId });
        if (!live)
            return null;
        const match = await this.getMatch(matchId);
        return {
            ...live,
            player1: match.player1,
            player2: match.player2,
            guildId: match.guildId,
            editionId: match.editionId,
        };
    }
    async createSpotcheck(dto) {
        const match = await this.getMatch(dto.matchId);
        const spotcheckId = (0, uuid_1.v4)();
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
        await this.ductape.dbUpdate('matches', { id: dto.matchId }, {
            $set: { status: 'disputed' },
        });
        this.logger.log(`Created spotcheck ${spotcheckId} for match ${dto.matchId}`);
        return { ...spotcheck, match };
    }
    async addEvidence(spotcheckId, dto) {
        const spotcheck = await this.ductape.dbFindOne('spotchecks', { id: spotcheckId });
        if (!spotcheck) {
            throw new common_1.NotFoundException(`Spotcheck ${spotcheckId} not found`);
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
        return this.getSpotcheck(spotcheckId);
    }
    async resolveSpotcheck(spotcheckId, dto) {
        const spotcheck = await this.ductape.dbFindOne('spotchecks', { id: spotcheckId });
        if (!spotcheck) {
            throw new common_1.NotFoundException(`Spotcheck ${spotcheckId} not found`);
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
        const match = await this.ductape.dbFindOne('matches', { id: spotcheck.matchId });
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
        await this.usersService.updateUserStats(dto.winnerId, match.guildId, {
            won: true,
            creditsEarned: match.creditPot,
        });
        await this.usersService.updateUserStats(loserId, match.guildId, {
            won: false,
        });
        await this.usersService.updateCredits(dto.winnerId, {
            amount: match.creditPot,
            type: 'rc',
            operation: 'add',
        });
        this.logger.log(`Spotcheck ${spotcheckId} resolved - Winner: ${dto.winnerId}`);
        return this.getSpotcheck(spotcheckId);
    }
    async getSpotcheck(id) {
        const spotcheck = await this.ductape.dbFindOne('spotchecks', { id });
        if (!spotcheck) {
            throw new common_1.NotFoundException(`Spotcheck ${id} not found`);
        }
        const match = await this.getMatch(spotcheck.matchId);
        return { ...spotcheck, match };
    }
    async getPendingSpotchecks(userId) {
        const query = { status: { $in: ['pending', 'reviewing'] } };
        if (userId) {
            query.assignedTo = userId;
        }
        const spotchecks = await this.ductape.dbFindMany('spotchecks', query, {
            sort: { createdAt: -1 },
        });
        return Promise.all(spotchecks.map(async (s) => {
            const match = await this.getMatch(s.matchId);
            return { ...s, match };
        }));
    }
    async assignSpotcheck(spotcheckId, assignedTo) {
        await this.ductape.dbUpdate('spotchecks', { id: spotcheckId }, {
            $set: { assignedTo, status: 'reviewing' },
        });
        return this.getSpotcheck(spotcheckId);
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = MatchesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ductape_config_1.DuctapeService,
        graph_setup_service_1.GraphSetupService,
        users_service_1.UsersService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map