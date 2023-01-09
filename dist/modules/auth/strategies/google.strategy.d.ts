import { Strategy } from 'passport-google-oauth20';
import { UserGooglePayload } from '../auth.type';
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: unknown, done: (err: null | Error, data: object | UserGooglePayload) => void): Promise<void>;
}
export {};
