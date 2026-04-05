import { CompetitionsService } from './competitions.service';
import { CreateRunDto, RunResponseDto, CreateLeagueDto, LeagueResponseDto, UpdateStandingsDto, JoinCompetitionDto } from './dto/competition.dto';
export declare class CompetitionsController {
    private readonly competitionsService;
    constructor(competitionsService: CompetitionsService);
    createRun(dto: CreateRunDto): Promise<RunResponseDto>;
    joinRun(id: string, dto: JoinCompetitionDto): Promise<RunResponseDto>;
    leaveRun(id: string, dto: JoinCompetitionDto): Promise<{
        success: boolean;
    }>;
    startRun(id: string): Promise<RunResponseDto>;
    endRun(id: string, winnerId: string): Promise<RunResponseDto>;
    getRun(id: string): Promise<RunResponseDto>;
    getRuns(guildId?: string, type?: string, isActive?: string): Promise<RunResponseDto[]>;
    getActiveRuns(guildId?: string): Promise<RunResponseDto[]>;
    getUpcomingRuns(guildId?: string): Promise<RunResponseDto[]>;
    getUserRuns(userId: string): Promise<RunResponseDto[]>;
    createLeague(dto: CreateLeagueDto): Promise<LeagueResponseDto>;
    joinLeague(id: string, dto: JoinCompetitionDto): Promise<LeagueResponseDto>;
    startLeague(id: string): Promise<LeagueResponseDto>;
    updateStandings(id: string, dto: UpdateStandingsDto): Promise<LeagueResponseDto>;
    endLeague(id: string): Promise<LeagueResponseDto>;
    getLeague(id: string): Promise<LeagueResponseDto>;
    getLeagues(guildId?: string, status?: string, type?: string): Promise<LeagueResponseDto[]>;
    getUserLeagues(userId: string): Promise<LeagueResponseDto[]>;
}
