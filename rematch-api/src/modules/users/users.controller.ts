import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  LoginDto,
  UpdateUserDto,
  UpdateCreditsDto,
  UserResponseDto,
  AuthResponseDto,
  RankEntryDto,
  UserStatsDto,
  UpdatePasswordDto,
} from './dto/user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DuctapeService } from '../../config/ductape.config';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ductapeService: DuctapeService,
  ) {}

  // ==================== AUTH ====================

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async register(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
    return this.usersService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.usersService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(
    @CurrentUser() userId: string,
    @Headers('authorization') auth: string,
  ) {
    const token = auth?.replace('Bearer ', '') || '';
    return this.usersService.logout(userId, token);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'New token pair' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.usersService.refreshToken(refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired session' })
  async me(@CurrentUser() userId: string): Promise<UserResponseDto> {
    return this.usersService.getMe(userId);
  }

  @Put('me/password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'Password updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePassword(
    @CurrentUser() userId: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(userId, dto);
  }
  @Put('me/push-token')
  @ApiOperation({ summary: 'Update push notification token' })
  @ApiResponse({ status: 200, description: 'Token updated' })
  async updatePushToken(
    @CurrentUser() userId: string,
    @Body('token') token: string,
  ) {
    return this.usersService.updatePushToken(userId, token);
  }


  // ==================== USER CRUD ====================

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'online', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponseDto] })
  async findAll(
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
    @Query('online') online?: string,
  ): Promise<UserResponseDto[]> {
    return this.usersService.findAll({
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
      isOnline: online !== undefined ? online === 'true' : undefined,
    });
  }

  @Get('online')
  @ApiOperation({ summary: 'Get online users' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of online users', type: [UserResponseDto] })
  async getOnlineUsers(@Query('limit') limit?: number): Promise<UserResponseDto[]> {
    return this.usersService.getOnlineUsers(limit ? Number(limit) : 20);
  }

  @Get('rankings/:guildId')
  @ApiOperation({ summary: 'Get rankboard for a guild' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Rankboard entries', type: [RankEntryDto] })
  async getRankboard(
    @Param('guildId') guildId: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ): Promise<RankEntryDto[]> {
    return this.usersService.getRankboard(guildId, {
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, description: 'User details', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUsername(@Param('username') username: string): Promise<UserResponseDto> {
    return this.usersService.findByUsername(username);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Username already taken' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }

  @Get('me/avatar-upload-url')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a presigned URL for avatar upload' })
  @ApiResponse({ status: 200, description: 'Presigned URL and file path' })
  async getAvatarUploadUrl(
    @CurrentUser() userId: string,
    @Body('fileName') fileName: string,
    @Body('fileType') fileType: string,
  ) {
    return this.usersService.getAvatarUploadUrl(userId, fileName, fileType);
  }

  @Put('me/avatar-complete')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Complete avatar upload by updating user avatar URL' })
  @ApiResponse({ status: 200, description: 'Avatar updated', type: UserResponseDto })
  async completeAvatarUpload(
    @CurrentUser() userId: string,
    @Body('avatarUrl') avatarUrl: string,
  ) {
    return this.usersService.updateAvatar(userId, avatarUrl);
  }

  // ==================== ACHIEVEMENTS ====================

  @Get('achievements')
  @ApiOperation({ summary: 'Get all available achievements' })
  @ApiResponse({ status: 200, description: 'List of achievements' })
  async getAchievements() {
    return this.usersService.getAchievements();
  }

  @Get(':id/achievements')
  @ApiOperation({ summary: 'Get achievements for a specific user' })
  @ApiResponse({ status: 200, description: 'List of user achievements' })
  async getUserAchievements(@Param('id') id: string) {
    return this.usersService.getUserAchievements(id);
  }


  // ==================== CREDITS ====================

  @Put(':id/credits')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user credits' })
  @ApiResponse({ status: 200, description: 'Credits updated', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Insufficient credits' })
  async updateCredits(
    @Param('id') id: string,
    @Body() dto: UpdateCreditsDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateCredits(id, dto);
  }

  @Post(':id/xp')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Add XP to user' })
  @ApiResponse({ status: 200, description: 'XP added', type: UserResponseDto })
  async addXP(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ): Promise<UserResponseDto> {
    return this.usersService.addXP(id, amount);
  }

  // ==================== STATS ====================

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get user stats' })
  @ApiQuery({ name: 'guildId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'User stats', type: UserStatsDto })
  async getUserStats(
    @Param('id') id: string,
    @Query('guildId') guildId?: string,
  ): Promise<UserStatsDto> {
    return this.usersService.getUserStats(id, guildId);
  }

  @Get(':id/rank/:guildId')
  @ApiOperation({ summary: 'Get user rank in a guild' })
  @ApiResponse({ status: 200, description: 'User rank entry', type: RankEntryDto })
  async getUserRank(
    @Param('id') id: string,
    @Param('guildId') guildId: string,
  ): Promise<RankEntryDto | null> {
    return this.usersService.getUserRank(id, guildId);
  }

  // ==================== ONLINE STATUS ====================

  @Put(':id/online')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Set user online status' })
  @ApiResponse({ status: 200, description: 'Status updated', type: UserResponseDto })
  async setOnlineStatus(
    @Param('id') id: string,
    @Body('isOnline') isOnline: boolean,
  ): Promise<UserResponseDto> {
    return this.usersService.setOnlineStatus(id, isOnline);
  }
}
