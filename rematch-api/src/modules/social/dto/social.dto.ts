import { IsString, IsOptional, IsArray, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== CREW DTOs ====================

export class CreateCrewDto {
  @ApiProperty({ example: 'Night Owls' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'NITE' })
  @IsString()
  @MaxLength(10)
  tag: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: 'Best night-time players' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'user-001' })
  @IsString()
  leaderId: string;
}

export class CrewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tag: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  leaderId: string;

  @ApiProperty()
  members: any[];

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  wins: number;

  @ApiProperty()
  losses: number;

  @ApiProperty()
  rank: number;
}

// ==================== NOISE (Feed) DTOs ====================

export class CreateNoisePostDto {
  @ApiProperty({ example: 'user-001' })
  @IsString()
  authorId: string;

  @ApiProperty({ example: 'Just went on a 15-game win streak! Who wants smoke?' })
  @IsString()
  @MaxLength(500)
  content: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.png' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'https://example.com/clip.mp4' })
  @IsOptional()
  @IsString()
  clipUrl?: string;

  @ApiPropertyOptional({ example: 'guild-001' })
  @IsOptional()
  @IsString()
  guildId?: string;

  @ApiPropertyOptional({ example: ['ShadowStrike', 'NightHawk'] })
  @IsOptional()
  @IsArray()
  mentions?: string[];
}

export class NoisePostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  author: any;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  clipUrl?: string;

  @ApiPropertyOptional()
  guildId?: string;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  replies: number;

  @ApiProperty()
  isLiked: boolean;

  @ApiProperty()
  mentions: string[];

  @ApiProperty()
  createdAt: Date;
}

export class CreateReplyDto {
  @ApiProperty({ example: 'user-001' })
  @IsString()
  authorId: string;

  @ApiProperty({ example: 'Great game!' })
  @IsString()
  @MaxLength(300)
  content: string;
}

export class ReplyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  postId: string;

  @ApiProperty()
  author: any;

  @ApiProperty()
  content: string;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  isLiked: boolean;

  @ApiProperty()
  createdAt: Date;
}

// ==================== NOTIFICATION DTOs ====================

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({
    enum: [
      'match_found',
      'challenge_received',
      'challenge_accepted',
      'match_ready',
      'match_result',
      'verification_request',
      'tournament_update',
      'league_update',
      'feed_mention',
      'team_invite',
      'team_update',
    ],
  })
  type: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  isRead: boolean;

  @ApiPropertyOptional()
  data?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;
}

// ==================== ACTIVITY DTOs ====================

export class ActivityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  user: any;

  @ApiProperty({
    enum: [
      'match_won',
      'match_lost',
      'rank_achieved',
      'guild_joined',
      'crew_joined',
      'tournament_won',
      'achievement_unlocked',
    ],
  })
  type: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  data?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;
}
