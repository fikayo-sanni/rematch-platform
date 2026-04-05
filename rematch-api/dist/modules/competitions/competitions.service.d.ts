import { DuctapeService } from '../../config/ductape.config';
import { UsersService } from '../users/users.service';
import { CreateRunDto, CreateLeagueDto, UpdateStandingsDto } from './dto/competition.dto';
export declare class CompetitionsService {
    private readonly ductape;
    private readonly usersService;
    private readonly logger;
    constructor(ductape: DuctapeService, usersService: UsersService);
    createRun(dto: CreateRunDto): Promise<{
        id: string;
        name: string;
        type: "crew" | "daily" | "weekend" | "rank_push" | "special";
        guildId: string;
        editionId: string;
        creditPot: number;
        participantCount: number;
        maxParticipants: number;
        participantIds: never[];
        startsAt: Date;
        endsAt: Date;
        isActive: boolean;
        winnerId: null;
        createdAt: Date;
    }>;
    joinRun(runId: string, userId: string): Promise<any>;
    leaveRun(runId: string, userId: string): Promise<{
        success: boolean;
    }>;
    startRun(runId: string): Promise<any>;
    endRun(runId: string, winnerId: string): Promise<any>;
    getRun(id: string): Promise<any>;
    getRuns(options: {
        guildId?: string;
        type?: string;
        isActive?: boolean;
        limit?: number;
        skip?: number;
    }): Promise<any[]>;
    getActiveRuns(guildId?: string): Promise<any[]>;
    getUpcomingRuns(guildId?: string): Promise<any[]>;
    getUserRuns(userId: string): Promise<any[]>;
    createLeague(dto: CreateLeagueDto): Promise<{
        id: string;
        name: string;
        type: "round_robin" | "knockout" | "swiss";
        guildId: string;
        editionId: string;
        status: string;
        entryFee: number;
        prizePool: number;
        participantCount: number;
        maxParticipants: number;
        matchesPerPlayer: number;
        participantIds: never[];
        standings: never[];
        startsAt: Date;
        endsAt: Date;
        winnerId: null;
        createdAt: Date;
    }>;
    joinLeague(leagueId: string, userId: string): Promise<any>;
    startLeague(leagueId: string): Promise<any>;
    updateStandings(leagueId: string, dto: UpdateStandingsDto): Promise<any>;
    endLeague(leagueId: string): Promise<any>;
    getLeague(id: string): Promise<any>;
    getLeagues(options: {
        guildId?: string;
        status?: string;
        type?: string;
        limit?: number;
        skip?: number;
    }): Promise<any[]>;
    getUserLeagues(userId: string): Promise<any[]>;
}
