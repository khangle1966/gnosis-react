<<<<<<< HEAD
import { Injectable, } from '@nestjs/common';
=======
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
>>>>>>> 916cca0 (a)
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service'; // Giả sử bạn đã có UserService
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
<<<<<<< HEAD
import { Model } from 'mongoose';
import { UsergoogleService } from 'src/usergoogle/usergoogle.service';
import { Usergoogle } from 'src/usergoogle/entities/usergoogle.entity';
=======
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { UsergoogleService } from 'src/usergoogle/usergoogle.service';
import { Usergoogle } from 'src/usergoogle/entities/usergoogle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
>>>>>>> 916cca0 (a)
import axios from 'axios'
@Injectable()
export class AuthService {

    private jwksClient = jwksClient({
        jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    });


    constructor(
        @InjectModel('Usergoogle') private usergoogleModel: Model<Usergoogle>,

<<<<<<< HEAD
=======

>>>>>>> 916cca0 (a)
        private usergoogleService: UsergoogleService,
        private usersService: UserService,
        private jwtService: JwtService // Inject JwtService
    ) { }


<<<<<<< HEAD
=======
    async register(createUserDto: CreateUserDto): Promise<any> {
        // Kiểm tra xem người dùng đã tồn tại chưa
        let user = await this.usersService.findOne(createUserDto.email);
        if (user) {
            throw new ConflictException('Người dùng đã tồn tại');
        }

        // Mã hóa mật khẩu

        // Tạo uid tự động
        const uid = uuidv4();

        // Tạo người dùng mới với uid tự động
        user = await this.usersService.create({
            ...createUserDto,
            uid,
            password: createUserDto.password,
        });

        // Tạo token cho người dùng mới
        const token = await this.createTokenForUser(user);

        return { user, token };
    }
>>>>>>> 916cca0 (a)
    async verifyGoogleToken(idToken: string): Promise<any> {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return userInfo.data; // Trả về thông tin người dùng từ Google
    }

    async findOrCreateUser(googleUser: any): Promise<any> {
        let user = await this.usergoogleModel.findOne({ email: googleUser.email });
        if (!user) {
            user = new this.usergoogleModel({
                uid: googleUser.sub, // UID từ Google
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
            });
            await user.save();
        }
        return user;
    }

<<<<<<< HEAD
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
=======


    async validateUser(email: string, plainTextPassword: string): Promise<any> {
        try {
            const user = await this.usersService.findOneByEmail(email);
            if (!user) return null;

            const passwordsMatch = await bcrypt.compare(plainTextPassword, user.password);
            console.log(passwordsMatch);

            if (passwordsMatch) {
                const { password, ...result } = user;
                return result; // Trả về người dùng không bao gồm mật khẩu
            }

            return null; // Trả về null nếu mật khẩu không khớp
        } catch (error) {
            // Xử lý bất kỳ lỗi nào phát sinh từ UsersService hoặc bcrypt.compare
            throw new UnauthorizedException('Login failed');
        }
    }


>>>>>>> 916cca0 (a)
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    // Thêm phương thức mới cho việc xử lý đăng nhập Google


    async createTokenForUser(user: any): Promise<string> {
        const payload = { email: user.email, sub: user._id };
        return this.jwtService.sign(payload);
    }

}