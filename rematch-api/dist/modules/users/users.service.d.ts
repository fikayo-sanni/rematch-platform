import { DuctapeService } from '../../config/ductape.config';
import { GraphSetupService } from '../../database/graph-setup.service';
import { CreateUserDto, UpdateUserDto, LoginDto, UpdateCreditsDto } from './dto/user.dto';
export declare class UsersService {
    private readonly ductape;
    private readonly graphService;
    private readonly logger;
    constructor(ductape: DuctapeService, graphService: GraphSetupService);
    register(dto: CreateUserDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            avatar: string;
            bio: string;
            reputation: number;
            xp: number;
            level: number;
            credits: {
                rc: number;
                bc: number;
            };
            isOnline: boolean;
            createdAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: any;
        token: string;
    }>;
    logout(userId: string, token: string): Promise<{
        success: boolean;
    }>;
    validateSession(token: string): Promise<any>;
    private createSession;
    private hashPassword;
    findById(id: string): Promise<any>;
    findByUsername(username: string): Promise<any>;
    findAll(options?: {
        limit?: number;
        skip?: number;
        isOnline?: boolean;
    }): Promise<any[]>;
    update(id: string, dto: UpdateUserDto): Promise<any>;
    updateCredits(userId: string, dto: UpdateCreditsDto): Promise<any>;
    addXP(userId: string, amount: number): Promise<any>;
    private calculateLevel;
    getRankboard(guildId: string, options?: {
        limit?: number;
        skip?: number;
    }): Promise<{
        rank: number;
        user: any;
        wins: any;
        losses: any;
        creditsEarned: any;
        winStreak: any;
        change: number;
    }[]>;
    getUserRank(userId: string, guildId: string): Promise<{
        rank: number;
        user: any;
        wins: any;
        losses: any;
        creditsEarned: any;
        winStreak: any;
        change: number;
    } | null>;
    private getPreviousRank;
    getUserStats(userId: string, guildId?: string): Promise<any>;
    updateUserStats(userId: string, guildId: string, updates: {
        won?: boolean;
        playTime?: number;
        creditsEarned?: number;
        tournamentWin?: boolean;
    }): Promise<any>;
    getOnlineUsers(limit?: number): Promise<any[]>;
    setOnlineStatus(userId: string, isOnline: boolean): Promise<any>;
}
