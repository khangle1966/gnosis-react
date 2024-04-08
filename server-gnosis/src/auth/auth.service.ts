import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Giả sử bạn đã có UserService
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService // Inject JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // Thêm phương thức mới cho việc xử lý đăng nhập Google
    async validateOAuthLogin(profile: any): Promise<string> {
        // Giả sử profile có tất cả các trường cần thiết
        const userDto: CreateUserDto = {
            email: profile.email,
            name: profile.name,
            password: await bcrypt.hash(profile.sub, 10), // Mã hóa sub làm mật khẩu
            uid: profile.sub, // Lấy sub làm uid, nếu cần
            picture: profile.picture, // Thêm URL hình ảnh từ Google
            profile: profile // Hoặc chỉ các chi tiết cần thiết từ profile
        };

        let user = await this.usersService.findOne(userDto.email);
        if (!user) {
            user = await this.usersService.create(userDto); // Sử dụng DTO khi tạo người dùng
        }

        const payload = { email: user.email, sub: user.uid };
        return this.jwtService.sign(payload);
    }
    async createTokenForUser(user: any): Promise<string> {
        const payload = { email: user.email, sub: user.id }; // `sub` thường được sử dụng làm ID người dùng
        return this.jwtService.sign(payload); // Tạo token JWT
    }

}