import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== RUN (Tournament) DTOs ====================

export class CreateRunDto {
  @ApiProperty({ example: 'Daily Grind' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'daily', enum: ['daily', 'weekend', 'crew', 'rank_push', 'special'] })
  @IsEnum(['daily', 'weekend', 'crew', 'rank_push', 'special'])
  type: 'daily' | 'weekend' | 'crew' | 'rank_push' | 'special';

  @ApiProperty({ example: 'guild-001' })
  @IsString()
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  @IsString()
  editionId: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(100)
  creditPot: number;

  @ApiProperty({ example: 128 })
  @IsNumber()
  @Min(4)
  @Max(1024)
  maxParticipants: number;

  @ApiProperty({ example: '2024-01-20T10:00:00Z' })
  startsAt: Date;

  @ApiProperty({ example: '2024-01-20T18:00:00Z' })
  endsAt: Date;
}

export class RunResponseDto {
  @ApiProperty({ example: 'run-001' })
  id: string;

  @ApiProperty({ example: 'Daily Grind' })
  name: string;

  @ApiProperty({ example: 'daily' })
  type: string;

  @ApiProperty({ example: 'guild-001' })
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  editionId: string;

  @ApiProperty({ example: 5000 })
  creditPot: number;

  @ApiProperty({ example: 64 })
  participantCount: number;

  @ApiProperty({ example: 128 })
  maxParticipants: number;

  @ApiPropertyOptional()
  participants?: any[];

  @ApiProperty()
  startsAt: Date;

  @ApiProperty()
  endsAt: Date;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional()
  winner?: any;
}

// ==================== LEAGUE DTOs ====================

export class CreateLeagueDto {
  @ApiProperty({ example: 'Ultimate Champions League' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'round_robin', enum: ['round_robin', 'knockout', 'swiss'] })
  @IsEnum(['round_robin', 'knockout', 'swiss'])
  type: 'round_robin' | 'knockout' | 'swiss';

  @ApiProperty({ example: 'guild-001' })
  @IsString()
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  @IsString()
  editionId: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(10)
  entryFee: number;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(100)
  prizePool: number;

  @ApiProperty({ example: 16 })
  @IsNumber()
  @Min(4)
  @Max(64)
  maxParticipants: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  matchesPerPlayer: number;

  @ApiProperty({ example: '2024-01-25T10:00:00Z' })
  startsAt: Date;

  @ApiProperty({ example: '2024-02-01T18:00:00Z' })
  endsAt: Date;
}

export class LeagueStandingDto {
  @ApiProperty({ example: 'user-001' })
  userId: string;

  @ApiProperty()
  user: any;

  @ApiProperty({ example: 5 })
  played: number;

  @ApiProperty({ example: 4 })
  wins: number;

  @ApiProperty({ example: 1 })
  draws: number;

  @ApiProperty({ example: 0 })
  losses: number;

  @ApiProperty({ example: 12 })
  goalsFor: number;

  @ApiProperty({ example: 3 })
  goalsAgainst: number;

  @ApiProperty({ example: 13 })
  points: number;
}

export class LeagueResponseDto {
  @ApiProperty({ example: 'league-001' })
  id: string;

  @ApiProperty({ example: 'Ultimate Champions League' })
  name: string;

  @ApiProperty({ example: 'round_robin' })
  type: string;

  @ApiProperty({ example: 'guild-001' })
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  editionId: string;

  @ApiProperty({ example: 'active', enum: ['upcoming', 'active', 'completed'] })
  status: string;

  @ApiProperty({ example: 100 })
  entryFee: number;

  @ApiProperty({ example: 2500 })
  prizePool: number;

  @ApiProperty({ example: 12 })
  participantCount: number;

  @ApiProperty({ example: 16 })
  maxParticipants: number;

  @ApiProperty({ example: 10 })
  matchesPerPlayer: number;

  @ApiPropertyOptional()
  participants?: any[];

  @ApiPropertyOptional({ type: [LeagueStandingDto] })
  standings?: LeagueStandingDto[];

  @ApiProperty()
  startsAt: Date;

  @ApiProperty()
  endsAt: Date;

  @ApiPropertyOptional()
  winner?: any;
}

export class UpdateStandingsDto {
  @ApiProperty({ example: 'user-001' })
  @IsString()
  winnerId: string;

  @ApiProperty({ example: 'user-002' })
  @IsString()
  loserId: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  winnerGoals: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  loserGoals: number;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isDraw?: boolean;
}

export class JoinCompetitionDto {
  @ApiProperty({ example: 'user-001' })
  @IsString()
  userId: string;
}
