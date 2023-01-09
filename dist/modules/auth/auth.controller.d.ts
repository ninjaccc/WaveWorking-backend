import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(req: any): Promise<{
        token: string;
    }>;
    getProfile(req: any): any;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<any>;
}
