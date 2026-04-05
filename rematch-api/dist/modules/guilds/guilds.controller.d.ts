import { GuildsService } from './guilds.service';
import { CreateGuildDto, UpdateGuildDto, JoinGuildDto, GuildResponseDto, UserGuildResponseDto } from './dto/guild.dto';
export declare class GuildsController {
    private readonly guildsService;
    constructor(guildsService: GuildsService);
    create(dto: CreateGuildDto): Promise<GuildResponseDto>;
    findAll(limit?: number, skip?: number): Promise<GuildResponseDto[]>;
    findById(id: string): Promise<GuildResponseDto>;
    findBySlug(slug: string): Promise<GuildResponseDto>;
    update(id: string, dto: UpdateGuildDto): Promise<GuildResponseDto>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    join(id: string, dto: JoinGuildDto): Promise<UserGuildResponseDto>;
    leave(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    getMembers(id: string, limit?: number, skip?: number): Promise<any[]>;
    getUserGuilds(userId: string): Promise<UserGuildResponseDto[]>;
    checkMembership(id: string, userId: string): Promise<{
        isMember: boolean;
    }>;
    setActiveEdition(id: string, userId: string, editionId: string): Promise<UserGuildResponseDto | null>;
    getActiveNow(id: string): Promise<{
        activeNow: any;
    }>;
    refreshActiveNow(id: string): Promise<{
        activeNow: number;
    }>;
}
