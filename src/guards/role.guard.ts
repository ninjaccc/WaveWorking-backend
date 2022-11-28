import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from 'src/constants/role.constant';
import { User } from 'src/modules/users/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // 從req中取user資訊
    const user = context.switchToHttp().getRequest().user as User;
    return this.roleCheck(user.roleId, requiredRoles);
  }

  roleCheck(userRoleId: Role, currentRoles: Role[]) {
    if (userRoleId === null || userRoleId === undefined) {
      return false;
    }

    return currentRoles.includes(userRoleId);
  }
}
