export declare class EditionDto {
    id: string;
    name: string;
    year: number;
    isDefault: boolean;
}
export declare class CreateGuildDto {
    name: string;
    slug: string;
    logo?: string;
    banner?: string;
    description?: string;
    editions: EditionDto[];
    accentColor?: string;
}
export declare class UpdateGuildDto {
    name?: string;
    logo?: string;
    banner?: string;
    description?: string;
    editions?: EditionDto[];
    accentColor?: string;
}
export declare class GuildResponseDto {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    banner?: string;
    description?: string;
    editions: EditionDto[];
    memberCount: number;
    activeNow: number;
    accentColor: string;
}
export declare class JoinGuildDto {
    userId: string;
    activeEditionId?: string;
}
export declare class UserGuildResponseDto {
    guildId: string;
    guild: GuildResponseDto;
    joinedAt: Date;
    activeEditionId?: string;
}
