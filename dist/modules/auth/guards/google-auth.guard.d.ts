import { ExecutionContext } from '@nestjs/common';
declare const GoogleAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleAuthGuard extends GoogleAuthGuard_base {
    static getRequest(context: ExecutionContext): any;
    canActivate(context: ExecutionContext): Promise<boolean | never | any>;
}
export {};
