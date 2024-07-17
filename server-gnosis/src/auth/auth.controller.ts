import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Đăng nhập bằng email và mật khẩu
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Login failed'); // Ném ngoại lệ nếu đăng nhập thất bại
        }
        const token = await this.authService.login(user);
        return {
            message: 'Login success',
            user,
            token: token.access_token, // Đảm bảo rằng token được trả về dưới dạng một chuỗi
        };
    }

    // Đăng nhập bằng Google OAuth
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

    // Đăng ký người dùng mới
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }
}
