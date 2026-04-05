"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const ductape_config_1 = require("../../config/ductape.config");
const graph_setup_service_1 = require("../../database/graph-setup.service");
const uuid_1 = require("uuid");
let SocialService = class SocialService {
    ductape;
    graphService;
    constructor(ductape, graphService) {
        this.ductape = ductape;
        this.graphService = graphService;
    }
    async createCrew(createCrewDto) {
        const crewData = {
            id: (0, uuid_1.v4)(),
            name: createCrewDto.name,
            tag: createCrewDto.tag,
            logo: createCrewDto.logo,
            description: createCrewDto.description,
            leaderId: createCrewDto.leaderId,
            memberIds: [createCrewDto.leaderId],
            memberCount: 1,
            wins: 0,
            losses: 0,
            rank: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await this.ductape.dbInsert('crews', crewData);
        await this.ductape.dbInsert('crew_members', {
            id: (0, uuid_1.v4)(),
            crewId: crewData.id,
            userId: createCrewDto.leaderId,
            role: 'leader',
            joinedAt: new Date(),
        });
        await this.graphService.createCrewNode(crewData.id, crewData.name, crewData.tag);
        await this.graphService.userJoinsCrew(createCrewDto.leaderId, crewData.id, 'leader');
        return { ...crewData, members: [] };
    }
    async getCrew(crewId) {
        const crew = await this.ductape.dbFindOne('crews', { id: crewId });
        if (!crew) {
            throw new common_1.NotFoundException('Crew not found');
        }
        return crew;
    }
    async getCrews(limit = 20, offset = 0) {
        const crews = await this.ductape.dbFindMany('crews', {}, {
            limit,
            skip: offset,
            sort: { rank: 1 }
        });
        return crews;
    }
    async joinCrew(crewId, userId) {
        const crew = await this.getCrew(crewId);
        const existingMember = await this.ductape.dbFindOne('crew_members', {
            crewId,
            userId,
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member of this crew');
        }
        await this.ductape.dbInsert('crew_members', {
            id: (0, uuid_1.v4)(),
            crewId,
            userId,
            role: 'member',
            joinedAt: new Date(),
        });
        await this.ductape.dbUpdate('crews', { id: crewId }, {
            $push: { members: userId },
            $inc: { memberCount: 1 },
            $set: { updatedAt: new Date() },
        });
        await this.graphService.userJoinsCrew(userId, crewId, 'member');
        await this.createActivity(userId, 'crew_joined', `Joined crew ${crew.name}`);
    }
    async leaveCrew(crewId, userId) {
        const crew = await this.getCrew(crewId);
        if (crew.leaderId === userId) {
            throw new common_1.BadRequestException('Leader cannot leave the crew. Transfer leadership first.');
        }
        await this.ductape.dbDelete('crew_members', { crewId, userId });
        await this.ductape.dbUpdate('crews', { id: crewId }, {
            $pull: { members: userId },
            $inc: { memberCount: -1 },
            $set: { updatedAt: new Date() },
        });
    }
    async getCrewMembers(crewId) {
        const members = await this.ductape.dbFindMany('crew_members', { crewId });
        const enrichedMembers = await Promise.all(members.map(async (member) => {
            const user = await this.ductape.dbFindOne('users', { id: member.userId });
            return {
                ...member,
                user,
            };
        }));
        return enrichedMembers;
    }
    async getCrewLeaderboard(limit = 50) {
        const crews = await this.ductape.dbFindMany('crews', {}, {
            sort: { wins: -1, losses: 1 },
            limit,
        });
        return crews;
    }
    async createNoisePost(createPostDto) {
        const author = await this.ductape.dbFindOne('users', { id: createPostDto.authorId });
        if (!author) {
            throw new common_1.NotFoundException('Author not found');
        }
        const postData = {
            id: (0, uuid_1.v4)(),
            authorId: createPostDto.authorId,
            content: createPostDto.content,
            image: createPostDto.image,
            clipUrl: createPostDto.clipUrl,
            guildId: createPostDto.guildId,
            likes: 0,
            replies: 0,
            mentions: createPostDto.mentions || [],
            createdAt: new Date(),
        };
        await this.ductape.dbInsert('noise_posts', postData);
        const post = {
            ...postData,
            author,
            isLiked: false,
        };
        if (post.mentions && post.mentions.length > 0) {
            for (const mentionedUsername of post.mentions) {
                const mentionedUser = await this.ductape.dbFindOne('users', { username: mentionedUsername });
                if (mentionedUser) {
                    await this.createNotification(mentionedUser.id, 'feed_mention', 'You were mentioned!', `${author.username} mentioned you in a post`, { postId: post.id });
                }
            }
        }
        return post;
    }
    async getNoisePost(postId) {
        const post = await this.ductape.dbFindOne('noise_posts', { id: postId });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const author = await this.ductape.dbFindOne('users', { id: post.authorId });
        return {
            ...post,
            author,
        };
    }
    async getNoiseFeed(userId, limit = 20, offset = 0) {
        const posts = await this.ductape.dbFindMany('noise_posts', {}, {
            sort: { createdAt: -1 },
            limit,
            skip: offset,
        });
        const enrichedPosts = await Promise.all(posts.map(async (post) => {
            const author = await this.ductape.dbFindOne('users', { id: post.authorId });
            let isLiked = false;
            if (userId) {
                const like = await this.ductape.dbFindOne('noise_likes', {
                    postId: post.id,
                    userId,
                });
                isLiked = !!like;
            }
            return {
                ...post,
                author,
                isLiked,
            };
        }));
        return enrichedPosts;
    }
    async likePost(postId, userId) {
        const post = await this.ductape.dbFindOne('noise_posts', { id: postId });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const existingLike = await this.ductape.dbFindOne('noise_likes', {
            postId,
            userId,
        });
        if (existingLike) {
            await this.ductape.dbDelete('noise_likes', { postId, userId });
            await this.ductape.dbUpdate('noise_posts', { id: postId }, {
                $inc: { likes: -1 },
            });
        }
        else {
            await this.ductape.dbInsert('noise_likes', {
                id: (0, uuid_1.v4)(),
                postId,
                userId,
                createdAt: new Date(),
            });
            await this.ductape.dbUpdate('noise_posts', { id: postId }, {
                $inc: { likes: 1 },
            });
        }
    }
    async createReply(postId, createReplyDto) {
        const post = await this.ductape.dbFindOne('noise_posts', { id: postId });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const author = await this.ductape.dbFindOne('users', { id: createReplyDto.authorId });
        if (!author) {
            throw new common_1.NotFoundException('Author not found');
        }
        const reply = {
            id: (0, uuid_1.v4)(),
            postId,
            authorId: createReplyDto.authorId,
            content: createReplyDto.content,
            likes: 0,
            createdAt: new Date(),
        };
        await this.ductape.dbInsert('noise_replies', reply);
        await this.ductape.dbUpdate('noise_posts', { id: postId }, {
            $inc: { replies: 1 },
        });
        return {
            ...reply,
            author,
            isLiked: false,
        };
    }
    async getPostReplies(postId, userId) {
        const replies = await this.ductape.dbFindMany('noise_replies', { postId }, {
            sort: { createdAt: 1 },
        });
        const enrichedReplies = await Promise.all(replies.map(async (reply) => {
            const author = await this.ductape.dbFindOne('users', { id: reply.authorId });
            let isLiked = false;
            if (userId) {
                const like = await this.ductape.dbFindOne('reply_likes', {
                    replyId: reply.id,
                    userId,
                });
                isLiked = !!like;
            }
            return {
                ...reply,
                author,
                isLiked,
            };
        }));
        return enrichedReplies;
    }
    async createNotification(userId, type, title, message, data) {
        const notification = {
            id: (0, uuid_1.v4)(),
            userId,
            type: type,
            title,
            message,
            isRead: false,
            data,
            createdAt: new Date(),
        };
        await this.ductape.dbInsert('notifications', notification);
        try {
            await this.ductape.sendNotification('notification_created', {
                userId,
                type,
                title,
                message,
                data,
            });
        }
        catch (error) {
            console.error('Failed to send push notification:', error);
        }
        return notification;
    }
    async getUserNotifications(userId, limit = 50, unreadOnly = false) {
        const filter = { userId };
        if (unreadOnly) {
            filter.isRead = false;
        }
        const notifications = await this.ductape.dbFindMany('notifications', filter, {
            sort: { createdAt: -1 },
            limit,
        });
        return notifications;
    }
    async markNotificationRead(notificationId) {
        await this.ductape.dbUpdate('notifications', { id: notificationId }, {
            $set: { isRead: true },
        });
    }
    async markAllNotificationsRead(userId) {
        await this.ductape.dbUpdate('notifications', { userId, isRead: false }, {
            $set: { isRead: true },
        });
    }
    async getUnreadCount(userId) {
        const notifications = await this.ductape.dbFindMany('notifications', {
            userId,
            isRead: false,
        });
        return notifications.length;
    }
    async createActivity(userId, type, description, data) {
        const user = await this.ductape.dbFindOne('users', { id: userId });
        const activityData = {
            id: (0, uuid_1.v4)(),
            userId,
            type: type,
            description,
            data,
            createdAt: new Date(),
        };
        await this.ductape.dbInsert('activities', activityData);
        const activity = {
            ...activityData,
            user: user || { id: userId, username: 'Unknown' },
        };
        return activity;
    }
    async getUserActivity(userId, limit = 20) {
        const activities = await this.ductape.dbFindMany('activities', { userId }, {
            sort: { createdAt: -1 },
            limit,
        });
        const user = await this.ductape.dbFindOne('users', { id: userId });
        return activities.map((activity) => ({
            ...activity,
            user,
        }));
    }
    async getFriendsActivity(userId, limit = 50) {
        const friendIds = await this.graphService.getUserGuilds(userId);
        const activities = await this.ductape.dbFindMany('activities', {}, {
            sort: { createdAt: -1 },
            limit,
        });
        const enrichedActivities = await Promise.all(activities.map(async (activity) => {
            const user = await this.ductape.dbFindOne('users', { id: activity.userId });
            return {
                ...activity,
                user,
            };
        }));
        return enrichedActivities;
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ductape_config_1.DuctapeService,
        graph_setup_service_1.GraphSetupService])
], SocialService);
//# sourceMappingURL=social.service.js.map