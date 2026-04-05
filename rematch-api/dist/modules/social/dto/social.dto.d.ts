export declare class CreateCrewDto {
    name: string;
    tag: string;
    logo?: string;
    description?: string;
    leaderId: string;
}
export declare class CrewResponseDto {
    id: string;
    name: string;
    tag: string;
    logo?: string;
    description?: string;
    leaderId: string;
    members: any[];
    memberCount: number;
    wins: number;
    losses: number;
    rank: number;
}
export declare class CreateNoisePostDto {
    authorId: string;
    content: string;
    image?: string;
    clipUrl?: string;
    guildId?: string;
    mentions?: string[];
}
export declare class NoisePostResponseDto {
    id: string;
    author: any;
    content: string;
    image?: string;
    clipUrl?: string;
    guildId?: string;
    likes: number;
    replies: number;
    isLiked: boolean;
    mentions: string[];
    createdAt: Date;
}
export declare class CreateReplyDto {
    authorId: string;
    content: string;
}
export declare class ReplyResponseDto {
    id: string;
    postId: string;
    author: any;
    content: string;
    likes: number;
    isLiked: boolean;
    createdAt: Date;
}
export declare class NotificationResponseDto {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    data?: Record<string, any>;
    createdAt: Date;
}
export declare class ActivityResponseDto {
    id: string;
    userId: string;
    user: any;
    type: string;
    description: string;
    data?: Record<string, any>;
    createdAt: Date;
}
