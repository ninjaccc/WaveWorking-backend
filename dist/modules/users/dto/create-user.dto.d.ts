import { Role } from 'src/modules/auth/role.constant';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    roleId?: Role;
    gender: number;
}
