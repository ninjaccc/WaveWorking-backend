import { UsersService } from '../users/users.service';
import { User } from '../users/user.schema';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<Omit<WithMongooseId<User>, 'password'>>;
    validateGoogleUser(email: string, name: string): Promise<any>;
    login(user: any): Promise<{
        token: string;
    }>;
}
