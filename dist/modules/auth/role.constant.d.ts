export declare enum Role {
    Admin = 0,
    Manager = 1,
    User = 2,
    Guest = 3
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const IS_PUBLIC_KEY = "isPublic";
export declare const SkipJwtAuth: () => import("@nestjs/common").CustomDecorator<string>;
