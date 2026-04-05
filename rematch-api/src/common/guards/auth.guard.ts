import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { DuctapeService } from '../../config/ductape.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly ductape: DuctapeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const session = await this.ductape.verifySession(token);
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session token');
    }

    // Attach userId to request for use in controllers
    (request as any).userId = session.userId;
    (request as any).sessionData = session;

    return true;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;

    return token;
  }
}
