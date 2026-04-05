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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const social_service_1 = require("./social.service");
const social_dto_1 = require("./dto/social.dto");
let SocialController = class SocialController {
    socialService;
    constructor(socialService) {
        this.socialService = socialService;
    }
    async createCrew(createCrewDto) {
        return this.socialService.createCrew(createCrewDto);
    }
    async getCrews(limit, offset) {
        return this.socialService.getCrews(limit, offset);
    }
    async getCrewLeaderboard(limit) {
        return this.socialService.getCrewLeaderboard(limit);
    }
    async getCrew(crewId) {
        return this.socialService.getCrew(crewId);
    }
    async getCrewMembers(crewId) {
        return this.socialService.getCrewMembers(crewId);
    }
    async joinCrew(crewId, userId) {
        await this.socialService.joinCrew(crewId, userId);
        return { message: 'Successfully joined crew' };
    }
    async leaveCrew(crewId, userId) {
        await this.socialService.leaveCrew(crewId, userId);
        return { message: 'Successfully left crew' };
    }
    async createNoisePost(createPostDto) {
        return this.socialService.createNoisePost(createPostDto);
    }
    async getNoiseFeed(userId, limit, offset) {
        return this.socialService.getNoiseFeed(userId, limit, offset);
    }
    async getNoisePost(postId) {
        return this.socialService.getNoisePost(postId);
    }
    async likePost(postId, userId) {
        await this.socialService.likePost(postId, userId);
        return { message: 'Like status toggled' };
    }
    async createReply(postId, createReplyDto) {
        return this.socialService.createReply(postId, createReplyDto);
    }
    async getPostReplies(postId, userId) {
        return this.socialService.getPostReplies(postId, userId);
    }
    async getUserNotifications(userId, limit, unreadOnly) {
        return this.socialService.getUserNotifications(userId, limit, unreadOnly);
    }
    async getUnreadCount(userId) {
        const count = await this.socialService.getUnreadCount(userId);
        return { count };
    }
    async markNotificationRead(notificationId) {
        await this.socialService.markNotificationRead(notificationId);
        return { message: 'Notification marked as read' };
    }
    async markAllNotificationsRead(userId) {
        await this.socialService.markAllNotificationsRead(userId);
        return { message: 'All notifications marked as read' };
    }
    async getUserActivity(userId, limit) {
        return this.socialService.getUserActivity(userId, limit);
    }
    async getFriendsActivity(userId, limit) {
        return this.socialService.getFriendsActivity(userId, limit);
    }
};
exports.SocialController = SocialController;
__decorate([
    (0, common_1.Post)('crews'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new crew' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: social_dto_1.CrewResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_dto_1.CreateCrewDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createCrew", null);
__decorate([
    (0, common_1.Get)('crews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all crews' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [social_dto_1.CrewResponseDto] }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getCrews", null);
__decorate([
    (0, common_1.Get)('crews/leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get crew leaderboard' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [social_dto_1.CrewResponseDto] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getCrewLeaderboard", null);
__decorate([
    (0, common_1.Get)('crews/:crewId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get crew by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: social_dto_1.CrewResponseDto }),
    __param(0, (0, common_1.Param)('crewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getCrew", null);
__decorate([
    (0, common_1.Get)('crews/:crewId/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Get crew members' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('crewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getCrewMembers", null);
__decorate([
    (0, common_1.Post)('crews/:crewId/join'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Join a crew' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('crewId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "joinCrew", null);
__decorate([
    (0, common_1.Post)('crews/:crewId/leave'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Leave a crew' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('crewId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "leaveCrew", null);
__decorate([
    (0, common_1.Post)('noise'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new noise post' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: social_dto_1.NoisePostResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_dto_1.CreateNoisePostDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createNoisePost", null);
__decorate([
    (0, common_1.Get)('noise'),
    (0, swagger_1.ApiOperation)({ summary: 'Get noise feed' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [social_dto_1.NoisePostResponseDto] }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getNoiseFeed", null);
__decorate([
    (0, common_1.Get)('noise/:postId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get noise post by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: social_dto_1.NoisePostResponseDto }),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getNoisePost", null);
__decorate([
    (0, common_1.Post)('noise/:postId/like'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Like/unlike a noise post' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "likePost", null);
__decorate([
    (0, common_1.Post)('noise/:postId/replies'),
    (0, swagger_1.ApiOperation)({ summary: 'Reply to a noise post' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: social_dto_1.ReplyResponseDto }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, social_dto_1.CreateReplyDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createReply", null);
__decorate([
    (0, common_1.Get)('noise/:postId/replies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get replies to a noise post' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [social_dto_1.ReplyResponseDto] }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getPostReplies", null);
__decorate([
    (0, common_1.Get)('notifications/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notifications' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'unreadOnly', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [social_dto_1.NotificationResponseDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('unreadOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Boolean]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Get)('notifications/:userId/unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notification count' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Put)('notifications/:notificationId/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('notificationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "markNotificationRead", null);
__decorate([
    (0, common_1.Put)('notifications/:userId/read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "markAllNotificationsRead", null);
__decorate([
    (0, common_1.Get)('activity/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user activity' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [social_dto_1.ActivityResponseDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getUserActivity", null);
__decorate([
    (0, common_1.Get)('activity/:userId/feed'),
    (0, swagger_1.ApiOperation)({ summary: 'Get friends activity feed' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [social_dto_1.ActivityResponseDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getFriendsActivity", null);
exports.SocialController = SocialController = __decorate([
    (0, swagger_1.ApiTags)('Social'),
    (0, common_1.Controller)('social'),
    __metadata("design:paramtypes", [social_service_1.SocialService])
], SocialController);
//# sourceMappingURL=social.controller.js.map