import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SocialService } from './social.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateCrewDto,
  CrewResponseDto,
  CreateNoisePostDto,
  NoisePostResponseDto,
  CreateReplyDto,
  ReplyResponseDto,
  NotificationResponseDto,
  ActivityResponseDto,
} from './dto/social.dto';
import { UserResponseDto } from '../users/dto/user.dto';


@ApiTags('Social')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // ==================== CREWS ====================

  @Post('crews')
  @ApiOperation({ summary: 'Create a new crew' })
  @ApiResponse({ status: 201, type: CrewResponseDto })
  async createCrew(@Body() createCrewDto: CreateCrewDto) {
    return this.socialService.createCrew(createCrewDto);
  }

  @Get('crews')
  @ApiOperation({ summary: 'Get all crews' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, type: [CrewResponseDto] })
  async getCrews(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.socialService.getCrews(limit, offset);
  }

  @Get('crews/leaderboard')
  @ApiOperation({ summary: 'Get crew leaderboard' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [CrewResponseDto] })
  async getCrewLeaderboard(@Query('limit') limit?: number) {
    return this.socialService.getCrewLeaderboard(limit);
  }

  @Get('crews/:crewId')
  @ApiOperation({ summary: 'Get crew by ID' })
  @ApiResponse({ status: 200, type: CrewResponseDto })
  async getCrew(@Param('crewId') crewId: string) {
    return this.socialService.getCrew(crewId);
  }

  @Get('crews/:crewId/members')
  @ApiOperation({ summary: 'Get crew members' })
  @ApiResponse({ status: 200 })
  async getCrewMembers(@Param('crewId') crewId: string) {
    return this.socialService.getCrewMembers(crewId);
  }

  @Post('crews/:crewId/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join a crew' })
  @ApiResponse({ status: 200 })
  async joinCrew(
    @Param('crewId') crewId: string,
    @Body('userId') userId: string,
  ) {
    await this.socialService.joinCrew(crewId, userId);
    return { message: 'Successfully joined crew' };
  }

  @Post('crews/:crewId/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a crew' })
  @ApiResponse({ status: 200 })
  async leaveCrew(
    @Param('crewId') crewId: string,
    @Body('userId') userId: string,
  ) {
    await this.socialService.leaveCrew(crewId, userId);
    return { message: 'Successfully left crew' };
  }

  // ==================== NOISE (Feed) ====================

  @Post('noise')
  @ApiOperation({ summary: 'Create a new noise post' })
  @ApiResponse({ status: 201, type: NoisePostResponseDto })
  async createNoisePost(@Body() createPostDto: CreateNoisePostDto) {
    return this.socialService.createNoisePost(createPostDto);
  }

  @Get('noise')
  @ApiOperation({ summary: 'Get noise feed' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, type: [NoisePostResponseDto] })
  async getNoiseFeed(
    @Query('userId') userId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.socialService.getNoiseFeed(userId, limit, offset);
  }

  @Get('noise/:postId')
  @ApiOperation({ summary: 'Get noise post by ID' })
  @ApiResponse({ status: 200, type: NoisePostResponseDto })
  async getNoisePost(@Param('postId') postId: string) {
    return this.socialService.getNoisePost(postId);
  }

  @Post('noise/:postId/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like/unlike a noise post' })
  @ApiResponse({ status: 200 })
  async likePost(
    @Param('postId') postId: string,
    @Body('userId') userId: string,
  ) {
    await this.socialService.likePost(postId, userId);
    return { message: 'Like status toggled' };
  }


  @Delete('noise/:postId')
  @ApiBearerAuth()
  //@UseGuards(AuthGuard) // Assuming guarded
  @ApiOperation({ summary: 'Delete a noise post' })
  @ApiResponse({ status: 200, description: 'Post deleted' })
  async deletePost(
    @Param('postId') postId: string,
    @Body('userId') userId: string, // In real app, get from AuthGuard
  ) {
    await this.socialService.deleteNoisePost(postId, userId);
    return { message: 'Post deleted' };
  }

  @Get('noise/guild/:guildId')
  @ApiOperation({ summary: 'Get noise posts for a guild' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [NoisePostResponseDto] })
  async getGuildNoiseFeed(
    @Param('guildId') guildId: string,
    @Query('limit') limit?: number,
  ) {
    return this.socialService.getGuildNoiseFeed(guildId, limit ? Number(limit) : 20);
  }

  @Get('graph/suggestions/:userId')
  @ApiOperation({ summary: 'Get suggested opponents from same guilds' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async getGraphSuggestions(@Param('userId') userId: string) {
    return this.socialService.getGraphSuggestions(userId);
  }


  @Post('noise/:postId/replies')
  @ApiOperation({ summary: 'Reply to a noise post' })
  @ApiResponse({ status: 201, type: ReplyResponseDto })
  async createReply(
    @Param('postId') postId: string,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return this.socialService.createReply(postId, createReplyDto);
  }

  @Get('noise/:postId/replies')
  @ApiOperation({ summary: 'Get replies to a noise post' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({ status: 200, type: [ReplyResponseDto] })
  async getPostReplies(
    @Param('postId') postId: string,
    @Query('userId') userId?: string,
  ) {
    return this.socialService.getPostReplies(postId, userId);
  }

  @Post('noise/replies/:replyId/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like/unlike a noise reply' })
  @ApiResponse({ status: 200 })
  async likeReply(
    @Param('replyId') replyId: string,
    @Body('userId') userId: string,
  ) {
    await this.socialService.likeReply(replyId, userId);
    return { message: 'Like status toggled' };
  }


  // ==================== NOTIFICATIONS ====================

  @Get('notifications/:userId')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    return this.socialService.getUserNotifications(userId, limit, unreadOnly);
  }

  @Get('notifications/:userId/unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200 })
  async getUnreadCount(@Param('userId') userId: string) {
    const count = await this.socialService.getUnreadCount(userId);
    return { count };
  }

  @Put('notifications/:notificationId/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200 })
  async markNotificationRead(@Param('notificationId') notificationId: string) {
    await this.socialService.markNotificationRead(notificationId);
    return { message: 'Notification marked as read' };
  }

  @Put('notifications/:userId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200 })
  async markAllNotificationsRead(@Param('userId') userId: string) {
    await this.socialService.markAllNotificationsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  // ==================== ACTIVITY ====================

  @Get('activity/:userId')
  @ApiOperation({ summary: 'Get user activity' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [ActivityResponseDto] })
  async getUserActivity(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.socialService.getUserActivity(userId, limit);
  }

  @Get('activity/:userId/feed')
  @ApiOperation({ summary: 'Get friends activity feed' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [ActivityResponseDto] })
  async getFriendsActivity(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.socialService.getFriendsActivity(userId, limit);
  }
}
