import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers?.authorization;

    if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('unauthorized');
    }

    try {
      const payload = await this.jwt.verifyAsync(header.slice(7));
      const sub = payload?.sub;
      if (typeof sub !== 'string' || sub.length === 0) {
        throw new Error('missing subject');
      }
      request.userId = sub;
      return true;
    } catch {
      throw new UnauthorizedException('unauthorized');
    }
  }
}
