import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
}
