import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WebsocketWithUserInfo } from 'src/modules/events/events.type';
import { Role, ROLES_KEY } from '../role.constant';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const client = context.switchToWs().getClient() as WebsocketWithUserInfo;
    if (!client.userId) {
      client.send(
        JSON.stringify({
          event: 'error',
          data: {
            message: 'unauthorized',
          },
        }),
      );
      return false;
    }

    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // 如果沒有在event上指定role，表示該event任何角色都可以直接訪問
    if (!requiredRoles) {
      return true;
    }

    const roleId = client.roleId as unknown as Role;
    const canActive =
      roleId !== null && roleId !== undefined && requiredRoles.includes(roleId);
    if (canActive) {
      return true;
    } else {
      client.send(
        JSON.stringify({
          event: 'error',
          data: {
            message: 'permission denied',
          },
        }),
      );
      return false;
    }
  }
}
