export declare class CreateRunDto {
    name: string;
    type: 'daily' | 'weekend' | 'crew' | 'rank_push' | 'special';
    guildId: string;
    editionId: string;
    creditPot: number;
    maxParticipants: number;
    startsAt: Date;
    endsAt: Date;
}
export declare class RunResponseDto {
    id: string;
    name: string;
    type: string;
    guildId: string;
    editionId: string;
    creditPot: number;
    participantCount: number;
    maxParticipants: number;
    participants?: any[];
    startsAt: Date;
    endsAt: Date;
    isActive: boolean;
    winner?: any;
}
export declare class CreateLeagueDto {
    name: string;
    type: 'round_robin' | 'knockout' | 'swiss';
    guildId: string;
    editionId: string;
    entryFee: number;
    prizePool: number;
    maxParticipants: number;
    matchesPerPlayer: number;
    startsAt: Date;
    endsAt: Date;
}
export declare class LeagueStandingDto {
    userId: string;
    user: any;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
}
export declare class LeagueResponseDto {
    id: string;
    name: string;
    type: string;
    guildId: string;
    editionId: string;
    status: string;
    entryFee: number;
    prizePool: number;
    participantCount: number;
    maxParticipants: number;
    matchesPerPlayer: number;
    participants?: any[];
    standings?: LeagueStandingDto[];
    startsAt: Date;
    endsAt: Date;
    winner?: any;
}
export declare class UpdateStandingsDto {
    winnerId: string;
    loserId: string;
    winnerGoals: number;
    loserGoals: number;
    isDraw?: boolean;
}
export declare class JoinCompetitionDto {
    userId: string;
}
