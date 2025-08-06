import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        token: string;
        user: {
            id: any;
            name: string;
            email: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: any;
            name: string;
            email: string;
        };
    }>;
    validateUser(email: string, password: string): Promise<import("../users/schemas/user.schema").UserDocument>;
}
