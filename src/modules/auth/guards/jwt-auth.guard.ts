import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../role.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    console.log(`該api是否公開: ${isPublic}`);
    // 如果是公開的，任何人都可以訪問該api
    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user) {
    // 处理 info
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
