import { IsEmail, IsString, IsOptional, MinLength, MaxLength, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ShadowStrike' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'shadow@rematch.gg' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'Competitive FIFA player. Come catch these hands.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'shadow@rematch.gg' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'NewUsername' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({ example: 'New bio here' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 'user-001' })
  id: string;

  @ApiProperty({ example: 'ShadowStrike' })
  username: string;

  @ApiProperty({ example: 'shadow@rematch.gg' })
  email: string;

  @ApiPropertyOptional({ example: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=user-001' })
  avatar?: string;

  @ApiPropertyOptional({ example: 'Competitive FIFA player. Come catch these hands.' })
  bio?: string;

  @ApiProperty({ example: 4.8 })
  reputation: number;

  @ApiProperty({ example: 12500 })
  xp: number;

  @ApiProperty({ example: 24 })
  level: number;

  @ApiProperty({ example: { rc: 2450, bc: 150 } })
  credits: { rc: number; bc: number };

  @ApiProperty({ example: true })
  isOnline: boolean;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  createdAt: Date;
}

export class RankEntryDto {
  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty({ example: 187 })
  wins: number;

  @ApiProperty({ example: 23 })
  losses: number;

  @ApiProperty({ example: 45200 })
  creditsEarned: number;

  @ApiProperty({ example: 12 })
  winStreak: number;

  @ApiProperty({ example: 2 })
  change: number;
}

export class AuthResponseDto {
  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty({ example: 'user-session:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;

  @ApiPropertyOptional({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken?: string;
}

export class UserStatsDto {
  @ApiProperty({ example: 'user-001' })
  userId: string;

  @ApiProperty({ example: 180 })
  totalMatches: number;

  @ApiProperty({ example: 142 })
  wins: number;

  @ApiProperty({ example: 38 })
  losses: number;

  @ApiPropertyOptional({ example: 0 })
  draws?: number;

  @ApiProperty({ example: 78.9 })
  winRate: number;

  @ApiProperty({ example: 3 })
  winStreak: number;

  @ApiProperty({ example: 12 })
  highestWinStreak: number;

  @ApiProperty({ example: 32100 })
  totalCreditsWon: number;

  @ApiProperty({ example: 5200 })
  totalCreditsLost: number;
}

export class UpdateCreditsDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'rc', enum: ['rc', 'bc'] })
  @IsString()
  type: 'rc' | 'bc';

  @ApiProperty({ example: 'add', enum: ['add', 'subtract'] })
  @IsString()
  operation: 'add' | 'subtract';
}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty({ example: 'newSecurePassword456' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

