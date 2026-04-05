import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LivekitService {
  private apiKey: string;
  private apiSecret: string;
  private serverUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('LIVEKIT_API_KEY', '');
    this.apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET', '');
    this.serverUrl = this.configService.get<string>('LIVEKIT_SERVER_URL', 'wss://livekit.example.com');
  }

  async generateToken(
    roomName: string,
    participantId: string,
    participantName: string,
  ): Promise<{ token: string; serverUrl: string }> {
    // If LiveKit is not configured, return a mock token for development
    if (!this.apiKey || !this.apiSecret) {
      console.warn('LiveKit not configured - returning mock token');
      return {
        token: 'mock-token-for-development',
        serverUrl: this.serverUrl,
      };
    }

    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: participantId,
      name: participantName,
      // Token expires in 6 hours
      ttl: 6 * 60 * 60,
    });

    // Grant permissions for the room
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return {
      token,
      serverUrl: this.serverUrl,
    };
  }

  getServerUrl(): string {
    return this.serverUrl;
  }
}
