import { SocialService } from './social.service';
import { CreateCrewDto, CreateNoisePostDto, CreateReplyDto } from './dto/social.dto';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    createCrew(createCrewDto: CreateCrewDto): Promise<import("../../common/interfaces").Crew>;
    getCrews(limit?: number, offset?: number): Promise<import("../../common/interfaces").Crew[]>;
    getCrewLeaderboard(limit?: number): Promise<import("../../common/interfaces").Crew[]>;
    getCrew(crewId: string): Promise<import("../../common/interfaces").Crew>;
    getCrewMembers(crewId: string): Promise<any[]>;
    joinCrew(crewId: string, userId: string): Promise<{
        message: string;
    }>;
    leaveCrew(crewId: string, userId: string): Promise<{
        message: string;
    }>;
    createNoisePost(createPostDto: CreateNoisePostDto): Promise<import("../../common/interfaces").NoisePost>;
    getNoiseFeed(userId?: string, limit?: number, offset?: number): Promise<any[]>;
    getNoisePost(postId: string): Promise<import("../../common/interfaces").NoisePost & {
        author: any;
    }>;
    likePost(postId: string, userId: string): Promise<{
        message: string;
    }>;
    createReply(postId: string, createReplyDto: CreateReplyDto): Promise<any>;
    getPostReplies(postId: string, userId?: string): Promise<any[]>;
    getUserNotifications(userId: string, limit?: number, unreadOnly?: boolean): Promise<import("../../common/interfaces").Notification[]>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markNotificationRead(notificationId: string): Promise<{
        message: string;
    }>;
    markAllNotificationsRead(userId: string): Promise<{
        message: string;
    }>;
    getUserActivity(userId: string, limit?: number): Promise<any[]>;
    getFriendsActivity(userId: string, limit?: number): Promise<any[]>;
}
