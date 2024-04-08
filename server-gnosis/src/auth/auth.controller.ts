import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

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
    async googleLogin(@Body() body: { idToken: string }) {
        // Xác thực ID token với Google
        const googleUser = await this.authService.verifyGoogleToken(body.idToken);
        if (!googleUser) {
            throw new UnauthorizedException('Invalid Google ID token');
        }

        // Kiểm tra người dùng đã tồn tại trong database hay chưa và xử lý tương ứng
        // Nếu chưa tồn tại, có thể tạo một tài khoản mới với thông tin từ Google
        const user = await this.authService.findOrCreateUser(googleUser);

        // Tạo token cho người dùng
        const token = await this.authService.login(user);
        return {
            message: 'Google login success',
            user,
            token, // Trả về token cho client
        };
    }

}
