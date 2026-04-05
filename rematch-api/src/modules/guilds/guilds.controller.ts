import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GuildsService } from './guilds.service';
import {
  CreateGuildDto,
  UpdateGuildDto,
  JoinGuildDto,
  GuildResponseDto,
  UserGuildResponseDto,
} from './dto/guild.dto';

@ApiTags('Guilds')
@Controller('guilds')
export class GuildsController {
  constructor(private readonly guildsService: GuildsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new guild (game)' })
  @ApiResponse({ status: 201, description: 'Guild created', type: GuildResponseDto })
  @ApiResponse({ status: 409, description: 'Guild slug already exists' })
  async create(@Body() dto: CreateGuildDto): Promise<GuildResponseDto> {
    return this.guildsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all guilds' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of guilds', type: [GuildResponseDto] })
  async findAll(
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ): Promise<GuildResponseDto[]> {
    return this.guildsService.findAll({
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guild by ID' })
  @ApiResponse({ status: 200, description: 'Guild details', type: GuildResponseDto })
  @ApiResponse({ status: 404, description: 'Guild not found' })
  async findById(@Param('id') id: string): Promise<GuildResponseDto> {
    return this.guildsService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get guild by slug' })
  @ApiResponse({ status: 200, description: 'Guild details', type: GuildResponseDto })
  @ApiResponse({ status: 404, description: 'Guild not found' })
  async findBySlug(@Param('slug') slug: string): Promise<GuildResponseDto> {
    return this.guildsService.findBySlug(slug);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update guild' })
  @ApiResponse({ status: 200, description: 'Guild updated', type: GuildResponseDto })
  @ApiResponse({ status: 404, description: 'Guild not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGuildDto,
  ): Promise<GuildResponseDto> {
    return this.guildsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete guild' })
  @ApiResponse({ status: 200, description: 'Guild deleted' })
  @ApiResponse({ status: 404, description: 'Guild not found' })
  async delete(@Param('id') id: string) {
    return this.guildsService.delete(id);
  }

  // ==================== MEMBERSHIP ====================

  @Post(':id/join')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a guild' })
  @ApiResponse({ status: 201, description: 'Joined guild', type: UserGuildResponseDto })
  @ApiResponse({ status: 404, description: 'Guild not found' })
  @ApiResponse({ status: 409, description: 'Already a member' })
  async join(
    @Param('id') id: string,
    @Body() dto: JoinGuildDto,
  ): Promise<UserGuildResponseDto> {
    return this.guildsService.join(id, dto);
  }

  @Post(':id/leave')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a guild' })
  @ApiResponse({ status: 200, description: 'Left guild' })
  @ApiResponse({ status: 404, description: 'Guild or membership not found' })
  async leave(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.guildsService.leave(id, userId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get guild members' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of members' })
  async getMembers(
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    return this.guildsService.getGuildMembers(id, {
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get guilds for a user' })
  @ApiResponse({ status: 200, description: 'User guilds', type: [UserGuildResponseDto] })
  async getUserGuilds(@Param('userId') userId: string): Promise<UserGuildResponseDto[]> {
    return this.guildsService.getUserGuilds(userId);
  }

  @Get(':id/membership/:userId')
  @ApiOperation({ summary: 'Check if user is a member' })
  @ApiResponse({ status: 200, description: 'Membership status' })
  async checkMembership(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const isMember = await this.guildsService.isGuildMember(userId, id);
    return { isMember };
  }

  // ==================== EDITIONS ====================

  @Put(':id/edition/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set active edition for user in guild' })
  @ApiResponse({ status: 200, description: 'Edition updated', type: UserGuildResponseDto })
  async setActiveEdition(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body('editionId') editionId: string,
  ): Promise<UserGuildResponseDto | null> {
    return this.guildsService.setActiveEdition(userId, id, editionId);
  }

  // ==================== ACTIVITY ====================

  @Get(':id/active')
  @ApiOperation({ summary: 'Get active user count' })
  @ApiResponse({ status: 200, description: 'Active count' })
  async getActiveNow(@Param('id') id: string) {
    const activeNow = await this.guildsService.getActiveNow(id);
    return { activeNow };
  }

  @Post(':id/refresh-active')
  @ApiOperation({ summary: 'Refresh active user count' })
  @ApiResponse({ status: 200, description: 'Active count refreshed' })
  async refreshActiveNow(@Param('id') id: string) {
    const activeNow = await this.guildsService.updateActiveNow(id);
    return { activeNow };
  }
}
