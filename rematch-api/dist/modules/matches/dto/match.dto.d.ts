export declare class CreatePullDto {
    guildId: string;
    editionId: string;
    initiatorId: string;
    creditPot: number;
    expiryMinutes?: number;
}
export declare class AcceptPullDto {
    opponentId: string;
}
export declare class PullResponseDto {
    id: string;
    guildId: string;
    editionId: string;
    initiator: any;
    opponent?: any;
    creditPot: number;
    status: string;
    createdAt: Date;
    expiresAt: Date;
}
export declare class CreateCallDto {
    guildId: string;
    editionId: string;
    challengerId: string;
    challengedId: string;
    creditPot: number;
    message?: string;
    expiryMinutes?: number;
}
export declare class CallResponseDto {
    id: string;
    guildId: string;
    editionId: string;
    challenger: any;
    challenged: any;
    creditPot: number;
    message?: string;
    status: string;
    createdAt: Date;
    expiresAt: Date;
}
export declare class CreateMatchDto {
    type: 'pull' | 'call';
    guildId: string;
    editionId: string;
    player1Id: string;
    player2Id: string;
    creditPot: number;
    scheduledAt?: Date;
    context?: {
        type: 'challenge' | 'tournament' | 'league';
        id: string;
        name: string;
    };
}
export declare class SubmitResultDto {
    winnerId: string;
    winnerScore: number;
    loserScore: number;
    duration?: number;
}
export declare class MatchResultDto {
    winnerId: string;
    loserId: string;
    winnerScore: number;
    loserScore: number;
    duration: number;
}
export declare class MatchContextDto {
    type: 'challenge' | 'tournament' | 'league';
    id: string;
    name: string;
}
export declare class MatchResponseDto {
    id: string;
    type: string;
    guildId: string;
    editionId: string;
    player1: any;
    player2: any;
    status: string;
    creditPot: number;
    createdAt: Date;
    startedAt?: Date;
    scheduledAt?: Date;
    completedAt?: Date;
    result?: MatchResultDto;
    context?: MatchContextDto;
}
export declare class LiveMatchDto {
    id: string;
    matchId: string;
    player1: any;
    player2: any;
    score: {
        player1: number;
        player2: number;
    };
    viewers: number;
    duration: string;
    guildId: string;
    editionId: string;
}
export declare class UpdateScoreDto {
    score: {
        player1: number;
        player2: number;
    };
}
export declare class CreateSpotcheckDto {
    matchId: string;
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
}
export declare class AddEvidenceDto {
    type: 'screenshot' | 'video';
    url: string;
    uploadedBy: string;
}
export declare class ResolveSpotcheckDto {
    winnerId: string;
    finalScore: {
        winner: number;
        loser: number;
    };
    notes?: string;
    resolvedBy: string;
}
export declare class SpotcheckResponseDto {
    id: string;
    matchId: string;
    match: MatchResponseDto;
    status: string;
    evidence: {
        type: string;
        url: string;
        uploadedBy: string;
        uploadedAt: Date;
    }[];
    player1Claim: any;
    player2Claim: any;
    resolution?: {
        winnerId: string;
        finalScore: {
            winner: number;
            loser: number;
        };
        notes?: string;
    };
    createdAt: Date;
    resolvedAt?: Date;
}
