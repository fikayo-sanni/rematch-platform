import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreatePullDto,
  AcceptPullDto,
  PullResponseDto,
  CreateCallDto,
  CallResponseDto,
  CreateMatchDto,
  SubmitResultDto,
  MatchResponseDto,
  LiveMatchDto,
  UpdateScoreDto,
  CreateSpotcheckDto,
  AddEvidenceDto,
  ResolveSpotcheckDto,
  SpotcheckResponseDto,
} from './dto/match.dto';

@ApiTags('Matches')
@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // ==================== PULLS ====================

  @Post('pulls')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a quick match pull' })
  @ApiResponse({ status: 201, description: 'Pull created', type: PullResponseDto })
  async createPull(@Body() dto: CreatePullDto): Promise<PullResponseDto> {
    return this.matchesService.createPull(dto);
  }

  @Post('pulls/:id/accept')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a pull' })
  @ApiResponse({ status: 200, description: 'Pull accepted, match created', type: MatchResponseDto })
  async acceptPull(
    @Param('id') id: string,
    @Body() dto: AcceptPullDto,
  ): Promise<MatchResponseDto> {
    return this.matchesService.acceptPull(id, dto);
  }

  @Post('pulls/:id/decline')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decline a pull' })
  @ApiResponse({ status: 200, description: 'Pull declined' })
  async declinePull(
    @Param('id') id: string,
    @Body('opponentId') opponentId: string,
  ) {
    return this.matchesService.declinePull(id, opponentId);
  }

  @Get('pulls/:id')
  @ApiOperation({ summary: 'Get pull by ID' })
  @ApiResponse({ status: 200, description: 'Pull details', type: PullResponseDto })
  async getPull(@Param('id') id: string): Promise<PullResponseDto> {
    return this.matchesService.getPull(id);
  }

  @Get('pulls/guild/:guildId')
  @ApiOperation({ summary: 'Get pending pulls for a guild' })
  @ApiQuery({ name: 'editionId', required: false })
  @ApiResponse({ status: 200, description: 'List of pulls', type: [PullResponseDto] })
  async getPendingPulls(
    @Param('guildId') guildId: string,
    @Query('editionId') editionId?: string,
  ): Promise<PullResponseDto[]> {
    return this.matchesService.getPendingPulls(guildId, editionId);
  }

  @Get('pulls/user/:userId')
  @ApiOperation({ summary: 'Get pulls for a user' })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'List of pulls', type: [PullResponseDto] })
  async getUserPulls(
    @Param('userId') userId: string,
    @Query('status') status?: string,
  ): Promise<PullResponseDto[]> {
    return this.matchesService.getUserPulls(userId, status);
  }

  // ==================== CALLS ====================

  @Post('calls')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a challenge' })
  @ApiResponse({ status: 201, description: 'Challenge created', type: CallResponseDto })
  async createCall(@Body() dto: CreateCallDto): Promise<CallResponseDto> {
    return this.matchesService.createCall(dto);
  }

  @Post('calls/:id/accept')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a challenge' })
  @ApiResponse({ status: 200, description: 'Challenge accepted, match created', type: MatchResponseDto })
  async acceptCall(@Param('id') id: string): Promise<MatchResponseDto> {
    return this.matchesService.acceptCall(id);
  }

  @Post('calls/:id/decline')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decline a challenge' })
  @ApiResponse({ status: 200, description: 'Challenge declined' })
  async declineCall(@Param('id') id: string) {
    return this.matchesService.declineCall(id);
  }

  @Get('calls/:id')
  @ApiOperation({ summary: 'Get challenge by ID' })
  @ApiResponse({ status: 200, description: 'Challenge details', type: CallResponseDto })
  async getCall(@Param('id') id: string): Promise<CallResponseDto> {
    return this.matchesService.getCall(id);
  }

  @Get('calls/guild/:guildId')
  @ApiOperation({ summary: 'Get challenges for a guild' })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'List of challenges', type: [CallResponseDto] })
  async getPendingCalls(
    @Param('guildId') guildId: string,
    @Query('status') status?: string,
  ): Promise<CallResponseDto[]> {
    return this.matchesService.getPendingCalls(guildId, status);
  }

  @Get('calls/user/:userId')
  @ApiOperation({ summary: 'Get challenges for a user' })
  @ApiQuery({ name: 'type', required: false, enum: ['sent', 'received'] })
  @ApiResponse({ status: 200, description: 'List of challenges', type: [CallResponseDto] })
  async getUserCalls(
    @Param('userId') userId: string,
    @Query('type') type?: 'sent' | 'received',
  ): Promise<CallResponseDto[]> {
    return this.matchesService.getUserCalls(userId, type);
  }

  // ==================== MATCHES ====================

  @Post('matches')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a match directly' })
  @ApiResponse({ status: 201, description: 'Match created', type: MatchResponseDto })
  async createMatch(@Body() dto: CreateMatchDto): Promise<MatchResponseDto> {
    return this.matchesService.createMatch(dto);
  }

  @Post('matches/:id/start')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a match' })
  @ApiResponse({ status: 200, description: 'Match started', type: MatchResponseDto })
  async startMatch(@Param('id') id: string): Promise<MatchResponseDto> {
    return this.matchesService.startMatch(id);
  }

  @Post('matches/:id/result')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit match result' })
  @ApiResponse({ status: 200, description: 'Result submitted', type: MatchResponseDto })
  async submitResult(
    @Param('id') id: string,
    @Body() dto: SubmitResultDto,
    @CurrentUser() user: any,
  ): Promise<MatchResponseDto> {
    return this.matchesService.submitResult(id, dto, user.id);
  }

  @Post('matches/:id/dispute')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dispute a match' })
  @ApiResponse({ status: 200, description: 'Match disputed', type: MatchResponseDto })
  async disputeMatch(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<MatchResponseDto> {
    return this.matchesService.disputeMatch(id, user.id);
  }

  @Post('matches/:id/cancel')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a match' })
  @ApiResponse({ status: 200, description: 'Match cancelled' })
  async cancelMatch(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.matchesService.cancelMatch(id, user.id);
  }

  @Get('matches/:id')
  @ApiOperation({ summary: 'Get match by ID' })
  @ApiResponse({ status: 200, description: 'Match details', type: MatchResponseDto })
  async getMatch(@Param('id') id: string): Promise<MatchResponseDto> {
    return this.matchesService.getMatch(id);
  }

  @Get('matches')
  @ApiOperation({ summary: 'Get matches' })
  @ApiQuery({ name: 'guildId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiResponse({ status: 200, description: 'List of matches', type: [MatchResponseDto] })
  async getMatches(
    @Query('guildId') guildId?: string,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ): Promise<MatchResponseDto[]> {
    return this.matchesService.getMatches({
      guildId,
      status,
      userId,
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get('matches/user/:userId/history')
  @ApiOperation({ summary: 'Get user match history' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Match history', type: [MatchResponseDto] })
  async getUserMatchHistory(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ): Promise<MatchResponseDto[]> {
    return this.matchesService.getUserMatchHistory(userId, limit ? Number(limit) : 10);
  }

  // ==================== LIVE MATCHES ====================

  @Get('live')
  @ApiOperation({ summary: 'Get live matches' })
  @ApiQuery({ name: 'guildId', required: false })
  @ApiResponse({ status: 200, description: 'List of live matches', type: [LiveMatchDto] })
  async getLiveMatches(@Query('guildId') guildId?: string): Promise<LiveMatchDto[]> {
    return this.matchesService.getLiveMatches(guildId);
  }

  @Get('live/:matchId')
  @ApiOperation({ summary: 'Get live match details' })
  @ApiResponse({ status: 200, description: 'Live match details', type: LiveMatchDto })
  async getLiveMatch(@Param('matchId') matchId: string): Promise<LiveMatchDto | null> {
    return this.matchesService.getLiveMatch(matchId);
  }

  @Put('live/:matchId/score')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update live match score' })
  @ApiResponse({ status: 200, description: 'Score updated', type: LiveMatchDto })
  async updateLiveScore(
    @Param('matchId') matchId: string,
    @Body() dto: UpdateScoreDto,
  ): Promise<LiveMatchDto | null> {
    return this.matchesService.updateLiveScore(matchId, dto.score);
  }

  @Post('live/:matchId/join')
  @ApiOperation({ summary: 'Join as viewer' })
  @ApiResponse({ status: 200, description: 'Joined as viewer' })
  async joinAsViewer(@Param('matchId') matchId: string) {
    await this.matchesService.addViewer(matchId);
    return { success: true };
  }

  @Post('live/:matchId/leave')
  @ApiOperation({ summary: 'Leave as viewer' })
  @ApiResponse({ status: 200, description: 'Left as viewer' })
  async leaveAsViewer(@Param('matchId') matchId: string) {
    await this.matchesService.removeViewer(matchId);
    return { success: true };
  }

  // ==================== SPOTCHECKS ====================

  @Post('spotchecks')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a spotcheck (dispute)' })
  @ApiResponse({ status: 201, description: 'Spotcheck created', type: SpotcheckResponseDto })
  async createSpotcheck(@Body() dto: CreateSpotcheckDto): Promise<SpotcheckResponseDto> {
    return this.matchesService.createSpotcheck(dto);
  }

  @Post('spotchecks/:id/evidence')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add evidence to spotcheck' })
  @ApiResponse({ status: 200, description: 'Evidence added', type: SpotcheckResponseDto })
  async addEvidence(
    @Param('id') id: string,
    @Body() dto: AddEvidenceDto,
  ): Promise<SpotcheckResponseDto> {
    return this.matchesService.addEvidence(id, dto);
  }

  @Post('spotchecks/:id/resolve')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resolve a spotcheck' })
  @ApiResponse({ status: 200, description: 'Spotcheck resolved', type: SpotcheckResponseDto })
  async resolveSpotcheck(
    @Param('id') id: string,
    @Body() dto: ResolveSpotcheckDto,
  ): Promise<SpotcheckResponseDto> {
    return this.matchesService.resolveSpotcheck(id, dto);
  }

  @Get('spotchecks/:id/evidence-url')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get evidence upload URL' })
  @ApiQuery({ name: 'fileName' })
  async getSpotcheckEvidenceUploadUrl(
    @Param('id') id: string,
    @Query('fileName') fileName: string,
  ) {
    return this.matchesService.getSpotcheckEvidenceUploadUrl(id, fileName);
  }

  @Get('spotchecks/:id')
  @ApiOperation({ summary: 'Get spotcheck by ID' })
  @ApiResponse({ status: 200, description: 'Spotcheck details', type: SpotcheckResponseDto })
  async getSpotcheck(@Param('id') id: string): Promise<SpotcheckResponseDto> {
    return this.matchesService.getSpotcheck(id);
  }

  @Get('spotchecks')
  @ApiOperation({ summary: 'Get pending spotchecks' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by assigned user' })
  @ApiResponse({ status: 200, description: 'List of spotchecks', type: [SpotcheckResponseDto] })
  async getPendingSpotchecks(@Query('userId') userId?: string): Promise<SpotcheckResponseDto[]> {
    return this.matchesService.getPendingSpotchecks(userId);
  }

  @Put('spotchecks/:id/assign')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign spotcheck to user' })
  @ApiResponse({ status: 200, description: 'Spotcheck assigned', type: SpotcheckResponseDto })
  async assignSpotcheck(
    @Param('id') id: string,
    @Body('assignedTo') assignedTo: string,
  ): Promise<SpotcheckResponseDto> {
    return this.matchesService.assignSpotcheck(id, assignedTo);
  }
}
