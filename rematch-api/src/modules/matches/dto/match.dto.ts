import { IsString, IsOptional, IsNumber, IsEnum, IsDate, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== PULL DTOs ====================

export class CreatePullDto {
  @ApiProperty({ example: 'guild-001' })
  @IsString()
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  @IsString()
  editionId: string;

  @ApiProperty({ example: 'user-001' })
  @IsString()
  initiatorId: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(10)
  @Max(10000)
  creditPot: number;

  @ApiPropertyOptional({ example: 5, description: 'Minutes until expiry' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  expiryMinutes?: number;
}

export class AcceptPullDto {
  @ApiProperty({ example: 'user-002' })
  @IsString()
  opponentId: string;
}

export class PullResponseDto {
  @ApiProperty({ example: 'pull-001' })
  id: string;

  @ApiProperty({ example: 'guild-001' })
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  editionId: string;

  @ApiProperty()
  initiator: any;

  @ApiPropertyOptional()
  opponent?: any;

  @ApiProperty({ example: 50 })
  creditPot: number;

  @ApiProperty({ example: 'pending', enum: ['pending', 'accepted', 'expired', 'declined'] })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  expiresAt: Date;
}

// ==================== CALL DTOs ====================

export class CreateCallDto {
  @ApiProperty({ example: 'guild-001' })
  @IsString()
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  @IsString()
  editionId: string;

  @ApiProperty({ example: 'user-001' })
  @IsString()
  challengerId: string;

  @ApiProperty({ example: 'user-002' })
  @IsString()
  challengedId: string;

  @ApiProperty({ example: 75 })
  @IsNumber()
  @Min(10)
  @Max(10000)
  creditPot: number;

  @ApiPropertyOptional({ example: "Let's run it! I've been practicing all week" })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 60, description: 'Minutes until expiry' })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(1440)
  expiryMinutes?: number;
}

export class CallResponseDto {
  @ApiProperty({ example: 'call-001' })
  id: string;

  @ApiProperty({ example: 'guild-001' })
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  editionId: string;

  @ApiProperty()
  challenger: any;

  @ApiProperty()
  challenged: any;

  @ApiProperty({ example: 75 })
  creditPot: number;

  @ApiPropertyOptional({ example: "Let's run it!" })
  message?: string;

  @ApiProperty({ example: 'pending', enum: ['pending', 'accepted', 'declined', 'expired'] })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  expiresAt: Date;
}

// ==================== MATCH DTOs ====================

export class CreateMatchDto {
  @ApiProperty({ example: 'pull', enum: ['pull', 'call'] })
  @IsEnum(['pull', 'call'])
  type: 'pull' | 'call';

  @ApiProperty({ example: 'guild-001' })
  @IsString()
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  @IsString()
  editionId: string;

  @ApiProperty({ example: 'user-001' })
  @IsString()
  player1Id: string;

  @ApiProperty({ example: 'user-002' })
  @IsString()
  player2Id: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  creditPot: number;

  @ApiPropertyOptional()
  @IsOptional()
  scheduledAt?: Date;

  @ApiPropertyOptional({ description: 'Context for tournament/league matches' })
  @IsOptional()
  context?: {
    type: 'challenge' | 'tournament' | 'league';
    id: string;
    name: string;
  };
}

export class SubmitResultDto {
  @ApiProperty({ example: 'user-001' })
  @IsString()
  winnerId: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  winnerScore: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  loserScore: number;

  @ApiPropertyOptional({ example: 45, description: 'Match duration in minutes' })
  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class MatchResultDto {
  @ApiProperty({ example: 'user-001' })
  winnerId: string;

  @ApiProperty({ example: 'user-002' })
  loserId: string;

  @ApiProperty({ example: 3 })
  winnerScore: number;

  @ApiProperty({ example: 1 })
  loserScore: number;

  @ApiProperty({ example: 45 })
  duration: number;
}

export class MatchContextDto {
  @ApiProperty({ example: 'tournament', enum: ['challenge', 'tournament', 'league'] })
  type: 'challenge' | 'tournament' | 'league';

  @ApiProperty({ example: 'run-001' })
  id: string;

  @ApiProperty({ example: 'Daily Grind' })
  name: string;
}

export class MatchResponseDto {
  @ApiProperty({ example: 'match-001' })
  id: string;

  @ApiProperty({ example: 'pull', enum: ['pull', 'call'] })
  type: string;

  @ApiProperty({ example: 'guild-001' })
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  editionId: string;

  @ApiProperty()
  player1: any;

  @ApiProperty()
  player2: any;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'disputed', 'cancelled'],
  })
  status: string;

  @ApiProperty({ example: 100 })
  creditPot: number;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  startedAt?: Date;

  @ApiPropertyOptional()
  scheduledAt?: Date;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional({ type: MatchResultDto })
  result?: MatchResultDto;

  @ApiPropertyOptional({ type: MatchContextDto })
  context?: MatchContextDto;
}

// ==================== LIVE MATCH DTOs ====================

export class LiveMatchDto {
  @ApiProperty({ example: 'live-001' })
  id: string;

  @ApiProperty({ example: 'match-001' })
  matchId: string;

  @ApiProperty()
  player1: any;

  @ApiProperty()
  player2: any;

  @ApiProperty({ example: { player1: 2, player2: 1 } })
  score: { player1: number; player2: number };

  @ApiProperty({ example: 156 })
  viewers: number;

  @ApiProperty({ example: '32:15' })
  duration: string;

  @ApiProperty({ example: 'guild-001' })
  guildId: string;

  @ApiProperty({ example: 'fc-25' })
  editionId: string;
}

export class UpdateScoreDto {
  @ApiProperty({ example: { player1: 2, player2: 1 } })
  score: { player1: number; player2: number };
}

// ==================== SPOTCHECK DTOs ====================

export class CreateSpotcheckDto {
  @ApiProperty({ example: 'match-001' })
  @IsString()
  matchId: string;

  @ApiProperty({ example: { playerId: 'user-001', claimedScore: { player: 3, opponent: 1 } } })
  player1Claim: {
    playerId: string;
    claimedScore: { player: number; opponent: number };
  };

  @ApiProperty({ example: { playerId: 'user-002', claimedScore: { player: 2, opponent: 2 } } })
  player2Claim: {
    playerId: string;
    claimedScore: { player: number; opponent: number };
  };
}

export class AddEvidenceDto {
  @ApiProperty({ example: 'screenshot', enum: ['screenshot', 'video'] })
  @IsEnum(['screenshot', 'video'])
  type: 'screenshot' | 'video';

  @ApiProperty({ example: 'https://storage.example.com/evidence/img123.png' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'user-001' })
  @IsString()
  uploadedBy: string;
}

export class ResolveSpotcheckDto {
  @ApiProperty({ example: 'user-001' })
  @IsString()
  winnerId: string;

  @ApiProperty({ example: { winner: 3, loser: 1 } })
  finalScore: { winner: number; loser: number };

  @ApiPropertyOptional({ example: 'Evidence clearly shows player1 won' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'user-admin' })
  @IsString()
  resolvedBy: string;
}

export class SpotcheckResponseDto {
  @ApiProperty({ example: 'spot-001' })
  id: string;

  @ApiProperty({ example: 'match-001' })
  matchId: string;

  @ApiProperty()
  match: MatchResponseDto;

  @ApiProperty({ example: 'pending', enum: ['pending', 'reviewing', 'resolved', 'escalated'] })
  status: string;

  @ApiProperty()
  evidence: { type: string; url: string; uploadedBy: string; uploadedAt: Date }[];

  @ApiProperty()
  player1Claim: any;

  @ApiProperty()
  player2Claim: any;

  @ApiPropertyOptional()
  resolution?: {
    winnerId: string;
    finalScore: { winner: number; loser: number };
    notes?: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  resolvedAt?: Date;
}
