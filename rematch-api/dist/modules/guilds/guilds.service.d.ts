import { DuctapeService } from '../../config/ductape.config';
import { GraphSetupService } from '../../database/graph-setup.service';
import { CreateGuildDto, UpdateGuildDto, JoinGuildDto } from './dto/guild.dto';
export declare class GuildsService {
    private readonly ductape;
    private readonly graphService;
    private readonly logger;
    constructor(ductape: DuctapeService, graphService: GraphSetupService);
    create(dto: CreateGuildDto): Promise<{
        id: string;
        name: string;
        slug: string;
        logo: string;
        banner: string | undefined;
        description: string | undefined;
        editions: import("./dto/guild.dto").EditionDto[];
        memberCount: number;
        activeNow: number;
        accentColor: string;
        createdAt: Date;
    }>;
    findById(id: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    findAll(options?: {
        limit?: number;
        skip?: number;
    }): Promise<any[]>;
    update(id: string, dto: UpdateGuildDto): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    join(guildId: string, dto: JoinGuildDto): Promise<{
        guild: any;
        id: string;
        userId: string;
        guildId: string;
        activeEditionId: any;
        joinedAt: Date;
    }>;
    leave(guildId: string, userId: string): Promise<{
        success: boolean;
    }>;
    getUserGuilds(userId: string): Promise<{
        guildId: any;
        guild: any;
        joinedAt: any;
        activeEditionId: any;
    }[]>;
    getGuildMembers(guildId: string, options?: {
        limit?: number;
        skip?: number;
    }): Promise<any[]>;
    isGuildMember(userId: string, guildId: string): Promise<boolean>;
    setActiveEdition(userId: string, guildId: string, editionId: string): Promise<{
        guildId: any;
        guild: any;
        joinedAt: any;
        activeEditionId: any;
    } | null>;
    getUserMembership(userId: string, guildId: string): Promise<{
        guildId: any;
        guild: any;
        joinedAt: any;
        activeEditionId: any;
    } | null>;
    updateActiveNow(guildId: string): Promise<number>;
    getActiveNow(guildId: string): Promise<any>;
}
