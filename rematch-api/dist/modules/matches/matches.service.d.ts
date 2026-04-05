import { DuctapeService } from '../../config/ductape.config';
import { GraphSetupService } from '../../database/graph-setup.service';
import { UsersService } from '../users/users.service';
import { CreatePullDto, AcceptPullDto, CreateCallDto, CreateMatchDto, SubmitResultDto, CreateSpotcheckDto, AddEvidenceDto, ResolveSpotcheckDto } from './dto/match.dto';
export declare class MatchesService {
    private readonly ductape;
    private readonly graphService;
    private readonly usersService;
    private readonly logger;
    constructor(ductape: DuctapeService, graphService: GraphSetupService, usersService: UsersService);
    createPull(dto: CreatePullDto): Promise<{
        initiator: any;
        id: string;
        guildId: string;
        editionId: string;
        initiatorId: string;
        opponentId: null;
        creditPot: number;
        status: string;
        createdAt: Date;
        expiresAt: Date;
    }>;
    acceptPull(pullId: string, dto: AcceptPullDto): Promise<{
        player1: any;
        player2: any;
        id: string;
        type: "pull" | "call";
        guildId: string;
        editionId: string;
        player1Id: string;
        player2Id: string;
        status: string;
        creditPot: number;
        createdAt: Date;
        scheduledAt: Date | undefined;
        context: {
            type: "challenge" | "tournament" | "league";
            id: string;
            name: string;
        } | undefined;
    }>;
    declinePull(pullId: string, opponentId: string): Promise<{
        success: boolean;
    }>;
    getPull(id: string): Promise<any>;
    getPendingPulls(guildId: string, editionId?: string): Promise<any[]>;
    getUserPulls(userId: string, status?: string): Promise<any[]>;
    createCall(dto: CreateCallDto): Promise<{
        challenger: any;
        challenged: any;
        id: string;
        guildId: string;
        editionId: string;
        challengerId: string;
        challengedId: string;
        creditPot: number;
        message: string | undefined;
        status: string;
        createdAt: Date;
        expiresAt: Date;
    }>;
    acceptCall(callId: string): Promise<{
        player1: any;
        player2: any;
        id: string;
        type: "pull" | "call";
        guildId: string;
        editionId: string;
        player1Id: string;
        player2Id: string;
        status: string;
        creditPot: number;
        createdAt: Date;
        scheduledAt: Date | undefined;
        context: {
            type: "challenge" | "tournament" | "league";
            id: string;
            name: string;
        } | undefined;
    }>;
    declineCall(callId: string): Promise<{
        success: boolean;
    }>;
    getCall(id: string): Promise<any>;
    getPendingCalls(guildId: string, status?: string): Promise<any[]>;
    getUserCalls(userId: string, type?: 'sent' | 'received'): Promise<any[]>;
    createMatch(dto: CreateMatchDto): Promise<{
        player1: any;
        player2: any;
        id: string;
        type: "pull" | "call";
        guildId: string;
        editionId: string;
        player1Id: string;
        player2Id: string;
        status: string;
        creditPot: number;
        createdAt: Date;
        scheduledAt: Date | undefined;
        context: {
            type: "challenge" | "tournament" | "league";
            id: string;
            name: string;
        } | undefined;
    }>;
    startMatch(matchId: string): Promise<any>;
    submitResult(matchId: string, dto: SubmitResultDto): Promise<any>;
    disputeMatch(matchId: string): Promise<any>;
    cancelMatch(matchId: string): Promise<{
        success: boolean;
    }>;
    getMatch(id: string): Promise<any>;
    getMatches(options: {
        guildId?: string;
        status?: string;
        userId?: string;
        limit?: number;
        skip?: number;
    }): Promise<any[]>;
    getUserMatchHistory(userId: string, limit?: number): Promise<any[]>;
    getLiveMatches(guildId?: string): Promise<any[]>;
    updateLiveScore(matchId: string, score: {
        player1: number;
        player2: number;
    }): Promise<any>;
    addViewer(matchId: string): Promise<void>;
    removeViewer(matchId: string): Promise<void>;
    getLiveMatch(matchId: string): Promise<any>;
    createSpotcheck(dto: CreateSpotcheckDto): Promise<{
        match: any;
        id: string;
        matchId: string;
        status: string;
        evidence: never[];
        player1Claim: {
            playerId: string;
            claimedScore: {
                player: number;
                opponent: number;
            };
        };
        player2Claim: {
            playerId: string;
            claimedScore: {
                player: number;
                opponent: number;
            };
        };
        createdAt: Date;
    }>;
    addEvidence(spotcheckId: string, dto: AddEvidenceDto): Promise<any>;
    resolveSpotcheck(spotcheckId: string, dto: ResolveSpotcheckDto): Promise<any>;
    getSpotcheck(id: string): Promise<any>;
    getPendingSpotchecks(userId?: string): Promise<any[]>;
    assignSpotcheck(spotcheckId: string, assignedTo: string): Promise<any>;
}
