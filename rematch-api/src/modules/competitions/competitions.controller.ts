import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CompetitionsService } from './competitions.service';
import {
  CreateRunDto,
  RunResponseDto,
  CreateLeagueDto,
  LeagueResponseDto,
  UpdateStandingsDto,
  JoinCompetitionDto,
} from './dto/competition.dto';

@ApiTags('Competitions')
@Controller()
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  // ==================== RUNS (Tournaments) ====================

  @Post('runs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a tournament' })
  @ApiResponse({ status: 201, description: 'Tournament created', type: RunResponseDto })
  async createRun(@Body() dto: CreateRunDto): Promise<RunResponseDto> {
    return this.competitionsService.createRun(dto);
  }

  @Post('runs/:id/join')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a tournament' })
  @ApiResponse({ status: 200, description: 'Joined tournament', type: RunResponseDto })
  async joinRun(@Param('id') id: string, @Body() dto: JoinCompetitionDto): Promise<RunResponseDto> {
    return this.competitionsService.joinRun(id, dto.userId);
  }

  @Post('runs/:id/leave')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a tournament' })
  async leaveRun(@Param('id') id: string, @Body() dto: JoinCompetitionDto) {
    return this.competitionsService.leaveRun(id, dto.userId);
  }

  @Post('runs/:id/start')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a tournament' })
  async startRun(@Param('id') id: string): Promise<RunResponseDto> {
    return this.competitionsService.startRun(id);
  }

  @Post('runs/:id/end')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'End a tournament' })
  async endRun(@Param('id') id: string, @Body('winnerId') winnerId: string): Promise<RunResponseDto> {
    return this.competitionsService.endRun(id, winnerId);
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get tournament by ID' })
  async getRun(@Param('id') id: string): Promise<RunResponseDto> {
    return this.competitionsService.getRun(id);
  }

  @Get('runs')
  @ApiOperation({ summary: 'Get tournaments' })
  @ApiQuery({ name: 'guildId', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  async getRuns(
    @Query('guildId') guildId?: string,
    @Query('type') type?: string,
    @Query('isActive') isActive?: string,
  ): Promise<RunResponseDto[]> {
    return this.competitionsService.getRuns({
      guildId,
      type,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
  }

  @Get('runs/active')
  @ApiOperation({ summary: 'Get active tournaments' })
  async getActiveRuns(@Query('guildId') guildId?: string): Promise<RunResponseDto[]> {
    return this.competitionsService.getActiveRuns(guildId);
  }

  @Get('runs/upcoming')
  @ApiOperation({ summary: 'Get upcoming tournaments' })
  async getUpcomingRuns(@Query('guildId') guildId?: string): Promise<RunResponseDto[]> {
    return this.competitionsService.getUpcomingRuns(guildId);
  }

  @Get('runs/user/:userId')
  @ApiOperation({ summary: 'Get user tournaments' })
  async getUserRuns(@Param('userId') userId: string): Promise<RunResponseDto[]> {
    return this.competitionsService.getUserRuns(userId);
  }

  // ==================== LEAGUES ====================

  @Post('leagues')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a league' })
  async createLeague(@Body() dto: CreateLeagueDto): Promise<LeagueResponseDto> {
    return this.competitionsService.createLeague(dto);
  }

  @Post('leagues/:id/join')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a league' })
  async joinLeague(@Param('id') id: string, @Body() dto: JoinCompetitionDto): Promise<LeagueResponseDto> {
    return this.competitionsService.joinLeague(id, dto.userId);
  }

  @Post('leagues/:id/start')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a league' })
  async startLeague(@Param('id') id: string): Promise<LeagueResponseDto> {
    return this.competitionsService.startLeague(id);
  }

  @Put('leagues/:id/standings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update league standings after a match' })
  async updateStandings(@Param('id') id: string, @Body() dto: UpdateStandingsDto): Promise<LeagueResponseDto> {
    return this.competitionsService.updateStandings(id, dto);
  }

  @Post('leagues/:id/end')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'End a league' })
  async endLeague(@Param('id') id: string): Promise<LeagueResponseDto> {
    return this.competitionsService.endLeague(id);
  }

  @Get('leagues/:id')
  @ApiOperation({ summary: 'Get league by ID' })
  async getLeague(@Param('id') id: string): Promise<LeagueResponseDto> {
    return this.competitionsService.getLeague(id);
  }

  @Get('leagues')
  @ApiOperation({ summary: 'Get leagues' })
  @ApiQuery({ name: 'guildId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  async getLeagues(
    @Query('guildId') guildId?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ): Promise<LeagueResponseDto[]> {
    return this.competitionsService.getLeagues({ guildId, status, type });
  }

  @Get('leagues/user/:userId')
  @ApiOperation({ summary: 'Get user leagues' })
  async getUserLeagues(@Param('userId') userId: string): Promise<LeagueResponseDto[]> {
    return this.competitionsService.getUserLeagues(userId);
  }
}
