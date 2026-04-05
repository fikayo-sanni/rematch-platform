import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTokenDto {
  @ApiProperty({ example: 'match-001', description: 'The room name (usually match ID)' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  roomName: string;

  @ApiProperty({ example: 'user-001', description: 'The user ID requesting the token' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'ShadowStrike', description: 'Display name for the user' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  username: string;
}

export class TokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;

  @ApiProperty({ example: 'wss://livekit.example.com' })
  serverUrl: string;
}
