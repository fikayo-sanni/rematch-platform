import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LivekitService } from './livekit.service';
import { GetTokenDto, TokenResponseDto } from './dto/livekit.dto';

@ApiTags('LiveKit')
@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  @Post('token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get LiveKit token for voice chat' })
  @ApiResponse({ status: 200, description: 'Token generated successfully', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getToken(@Body() dto: GetTokenDto): Promise<TokenResponseDto> {
    return this.livekitService.generateToken(dto.roomName, dto.userId, dto.username);
  }
}
