export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    bio?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class UpdateUserDto {
    username?: string;
    bio?: string;
    avatar?: string;
}
export declare class UserResponseDto {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    reputation: number;
    xp: number;
    level: number;
    credits: {
        rc: number;
        bc: number;
    };
    isOnline: boolean;
    createdAt: Date;
}
export declare class RankEntryDto {
    rank: number;
    user: UserResponseDto;
    wins: number;
    losses: number;
    creditsEarned: number;
    winStreak: number;
    change: number;
}
export declare class AuthResponseDto {
    user: UserResponseDto;
    token: string;
}
export declare class UserStatsDto {
    userId: string;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    currentStreak: number;
    bestStreak: number;
    totalPlayTime: number;
    creditsEarned: number;
    tournamentWins: number;
}
export declare class UpdateCreditsDto {
    amount: number;
    type: 'rc' | 'bc';
    operation: 'add' | 'subtract';
}
