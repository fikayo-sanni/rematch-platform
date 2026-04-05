import { UsersService } from './users.service';
import { CreateUserDto, LoginDto, UpdateUserDto, UpdateCreditsDto, UserResponseDto, AuthResponseDto, RankEntryDto, UserStatsDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(dto: CreateUserDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    logout(auth: string, userId: string): Promise<{
        success: boolean;
    }>;
    me(auth: string): Promise<UserResponseDto | null>;
    findAll(limit?: number, skip?: number, online?: boolean): Promise<UserResponseDto[]>;
    getOnlineUsers(limit?: number): Promise<UserResponseDto[]>;
    findById(id: string): Promise<UserResponseDto>;
    findByUsername(username: string): Promise<UserResponseDto>;
    update(id: string, dto: UpdateUserDto): Promise<UserResponseDto>;
    updateCredits(id: string, dto: UpdateCreditsDto): Promise<UserResponseDto>;
    addXP(id: string, amount: number): Promise<UserResponseDto>;
    getRankboard(guildId: string, limit?: number, skip?: number): Promise<RankEntryDto[]>;
    getUserRank(id: string, guildId: string): Promise<RankEntryDto | null>;
    getUserStats(id: string, guildId?: string): Promise<UserStatsDto>;
    setOnlineStatus(id: string, isOnline: boolean): Promise<UserResponseDto>;
}
