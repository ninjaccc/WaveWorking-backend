import { Strategy } from 'passport-jwt';
import { User } from 'src/modules/users/user.schema';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: Omit<User, 'password'>): Promise<Omit<User, "password">>;
}
export {};
