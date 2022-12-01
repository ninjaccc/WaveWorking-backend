import { SetMetadata } from '@nestjs/common';

export enum Role {
  Admin = 0,
  /** dj */
  Manager = 1,
  User = 2,
  Guest = 3,
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = 'isPublic';
// 有些api任何人都可以訪問，可使用此
export const SkipJwtAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
