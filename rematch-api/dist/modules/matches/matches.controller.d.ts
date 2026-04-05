import { MatchesService } from './matches.service';
import { CreatePullDto, AcceptPullDto, PullResponseDto, CreateCallDto, CallResponseDto, CreateMatchDto, SubmitResultDto, MatchResponseDto, LiveMatchDto, UpdateScoreDto, CreateSpotcheckDto, AddEvidenceDto, ResolveSpotcheckDto, SpotcheckResponseDto } from './dto/match.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    createPull(dto: CreatePullDto): Promise<PullResponseDto>;
    acceptPull(id: string, dto: AcceptPullDto): Promise<MatchResponseDto>;
    declinePull(id: string, opponentId: string): Promise<{
        success: boolean;
    }>;
    getPull(id: string): Promise<PullResponseDto>;
    getPendingPulls(guildId: string, editionId?: string): Promise<PullResponseDto[]>;
    getUserPulls(userId: string, status?: string): Promise<PullResponseDto[]>;
    createCall(dto: CreateCallDto): Promise<CallResponseDto>;
    acceptCall(id: string): Promise<MatchResponseDto>;
    declineCall(id: string): Promise<{
        success: boolean;
    }>;
    getCall(id: string): Promise<CallResponseDto>;
    getPendingCalls(guildId: string, status?: string): Promise<CallResponseDto[]>;
    getUserCalls(userId: string, type?: 'sent' | 'received'): Promise<CallResponseDto[]>;
    createMatch(dto: CreateMatchDto): Promise<MatchResponseDto>;
    startMatch(id: string): Promise<MatchResponseDto>;
    submitResult(id: string, dto: SubmitResultDto): Promise<MatchResponseDto>;
    disputeMatch(id: string): Promise<MatchResponseDto>;
    cancelMatch(id: string): Promise<{
        success: boolean;
    }>;
    getMatch(id: string): Promise<MatchResponseDto>;
    getMatches(guildId?: string, status?: string, userId?: string, limit?: number, skip?: number): Promise<MatchResponseDto[]>;
    getUserMatchHistory(userId: string, limit?: number): Promise<MatchResponseDto[]>;
    getLiveMatches(guildId?: string): Promise<LiveMatchDto[]>;
    getLiveMatch(matchId: string): Promise<LiveMatchDto | null>;
    updateLiveScore(matchId: string, dto: UpdateScoreDto): Promise<LiveMatchDto | null>;
    joinAsViewer(matchId: string): Promise<{
        success: boolean;
    }>;
    leaveAsViewer(matchId: string): Promise<{
        success: boolean;
    }>;
    createSpotcheck(dto: CreateSpotcheckDto): Promise<SpotcheckResponseDto>;
    addEvidence(id: string, dto: AddEvidenceDto): Promise<SpotcheckResponseDto>;
    resolveSpotcheck(id: string, dto: ResolveSpotcheckDto): Promise<SpotcheckResponseDto>;
    getSpotcheck(id: string): Promise<SpotcheckResponseDto>;
    getPendingSpotchecks(userId?: string): Promise<SpotcheckResponseDto[]>;
    assignSpotcheck(id: string, assignedTo: string): Promise<SpotcheckResponseDto>;
}
