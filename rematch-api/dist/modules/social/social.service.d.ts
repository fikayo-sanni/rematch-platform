import { DuctapeService } from '../../config/ductape.config';
import { GraphSetupService } from '../../database/graph-setup.service';
import { Crew, NoisePost, Notification, Activity } from '../../common/interfaces';
import { CreateCrewDto, CreateNoisePostDto, CreateReplyDto } from './dto/social.dto';
export declare class SocialService {
    private readonly ductape;
    private readonly graphService;
    constructor(ductape: DuctapeService, graphService: GraphSetupService);
    createCrew(createCrewDto: CreateCrewDto): Promise<Crew>;
    getCrew(crewId: string): Promise<Crew>;
    getCrews(limit?: number, offset?: number): Promise<Crew[]>;
    joinCrew(crewId: string, userId: string): Promise<void>;
    leaveCrew(crewId: string, userId: string): Promise<void>;
    getCrewMembers(crewId: string): Promise<any[]>;
    getCrewLeaderboard(limit?: number): Promise<Crew[]>;
    createNoisePost(createPostDto: CreateNoisePostDto): Promise<NoisePost>;
    getNoisePost(postId: string): Promise<NoisePost & {
        author: any;
    }>;
    getNoiseFeed(userId?: string, limit?: number, offset?: number): Promise<any[]>;
    likePost(postId: string, userId: string): Promise<void>;
    createReply(postId: string, createReplyDto: CreateReplyDto): Promise<any>;
    getPostReplies(postId: string, userId?: string): Promise<any[]>;
    createNotification(userId: string, type: string, title: string, message: string, data?: Record<string, any>): Promise<Notification>;
    getUserNotifications(userId: string, limit?: number, unreadOnly?: boolean): Promise<Notification[]>;
    markNotificationRead(notificationId: string): Promise<void>;
    markAllNotificationsRead(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    createActivity(userId: string, type: string, description: string, data?: Record<string, any>): Promise<Activity>;
    getUserActivity(userId: string, limit?: number): Promise<any[]>;
    getFriendsActivity(userId: string, limit?: number): Promise<any[]>;
}
