import { IsString, IsOptional, MaxLength, IsArray, ValidateNested, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EditionDto {
  @ApiProperty({ example: 'fc-25' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'FC 25' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2025 })
  @IsNumber()
  year: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isDefault: boolean;
}

export class CreateGuildDto {
  @ApiProperty({ example: 'EA FC' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'ea-fc' })
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.png' })
  @IsOptional()
  @IsString()
  banner?: string;

  @ApiPropertyOptional({ example: 'The official EA FC gaming community' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ type: [EditionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditionDto)
  editions: EditionDto[];

  @ApiPropertyOptional({ example: '#00FF87' })
  @IsOptional()
  @IsString()
  accentColor?: string;
}

export class UpdateGuildDto {
  @ApiPropertyOptional({ example: 'EA FC Updated' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/new-logo.png' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://example.com/new-banner.png' })
  @IsOptional()
  @IsString()
  banner?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ type: [EditionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EditionDto)
  editions?: EditionDto[];

  @ApiPropertyOptional({ example: '#FF6B00' })
  @IsOptional()
  @IsString()
  accentColor?: string;
}

export class GuildResponseDto {
  @ApiProperty({ example: 'guild-001' })
  id: string;

  @ApiProperty({ example: 'EA FC' })
  name: string;

  @ApiProperty({ example: 'ea-fc' })
  slug: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  logo?: string;

  @ApiPropertyOptional({ example: 'https://example.com/banner.png' })
  banner?: string;

  @ApiPropertyOptional({ example: 'The official EA FC gaming community' })
  description?: string;

  @ApiProperty({ type: [EditionDto] })
  editions: EditionDto[];

  @ApiProperty({ example: 24500 })
  memberCount: number;

  @ApiProperty({ example: 892 })
  activeNow: number;

  @ApiProperty({ example: '#00FF87' })
  accentColor: string;
}

export class JoinGuildDto {
  @ApiProperty({ example: 'user-001' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ example: 'fc-25' })
  @IsOptional()
  @IsString()
  activeEditionId?: string;
}

export class UserGuildResponseDto {
  @ApiProperty({ example: 'guild-001' })
  guildId: string;

  @ApiProperty()
  guild: GuildResponseDto;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  joinedAt: Date;

  @ApiPropertyOptional({ example: 'fc-25' })
  activeEditionId?: string;
}
