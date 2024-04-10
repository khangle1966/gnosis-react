import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Login failed');
        }
        const token = await this.authService.login(user);
        return {
            message: 'Login success',
            user,
            token, // Trả về token cho client
        };
    }

    @Post('google-login')
    async googleLogin(@Body('access_token') access_token: string) {
        const googleUser = await this.authService.verifyGoogleToken(access_token);
        const user = await this.authService.findOrCreateUser(googleUser);
        const token = await this.authService.createTokenForUser(user);
        return {
            message: 'Google login success',
            user,
            token,
        };
    }
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }
}