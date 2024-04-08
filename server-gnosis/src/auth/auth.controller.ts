import { Controller, Post, Res, Req, Get, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Login failed');
        }
        // Tạo token cho người dùng (nếu cần) và trả về thông tin cần thiết
        return {
            message: 'Login success',
            user,
            // token: ... nếu bạn dùng JWT hoặc một phương thức xác thực tương tự
        };
    }
    @Post('google-login') // Định nghĩa route cho đăng nhập bằng Google
    async googleLogin(@Body() body: { profile: any }) {
        const token = await this.authService.validateOAuthLogin(body.profile);
        // Trả về token cho client để xác thực sau khi đăng nhập thành công bằng Google
        return {
            message: 'Google login success',
            token,
        };
    }
    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleAuth(@Req() req: Request) {
        // Guard sẽ redirect người dùng tới Google cho xác thực
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        // Lấy thông tin người dùng từ đối tượng user đã được gắn vào request bởi passport
        // Đối tượng user này sẽ có cấu trúc tùy thuộc vào cách bạn cấu hình trong GoogleStrategy
        const user = req.user;

        // Kiểm tra xem đã có thông tin người dùng
        if (!user) {
            return res.redirect('http://localhost:4000/login?error=Unable to login with Google');
        }

        try {
            // Sử dụng AuthService để tạo token JWT cho người dùng
            // Điều này giả định rằng bạn đã có phương thức để tạo JWT dựa trên thông tin người dùng
            const token = await this.authService.createTokenForUser(user);

            // Chuyển hướng người dùng về phần frontend với token
            // Bạn có thể cần cấu hình để gửi token qua query parameter hoặc qua một phương thức khác tùy thuộc vào cách bạn xử lý token trên client
            return res.redirect(`http://localhost:4000/?token=${token}`);
        } catch (error) {
            console.error('Error generating token for user', error);
            return res.redirect('http://localhost:4000/login?error=Internal server error');
        }
    }

}

