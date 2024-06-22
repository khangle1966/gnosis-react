import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as jwksClient from 'jwks-rsa';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { UsergoogleService } from 'src/usergoogle/usergoogle.service';
import { Usergoogle } from 'src/usergoogle/entities/usergoogle.entity';
import axios from 'axios';

@Injectable()
export class AuthService {
    private jwksClient = jwksClient({
        jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    });

    constructor(
        @InjectModel('Usergoogle') private usergoogleModel: Model<Usergoogle>,
        private usergoogleService: UsergoogleService,
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async register(createUserDto: CreateUserDto): Promise<any> {
        let user = await this.usersService.findOne(createUserDto.email);
        if (user) {
            throw new ConflictException('Người dùng đã tồn tại');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const uid = uuidv4();
        user = await this.usersService.create({
            ...createUserDto,
            uid,
            password: hashedPassword,
        });

        const token = await this.createTokenForUser(user);
        return { user, token };
    }

    async verifyGoogleToken(idToken: string): Promise<any> {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return userInfo.data;
    }

    async findOrCreateUser(googleUser: any): Promise<any> {
        let user = await this.usergoogleModel.findOne({ email: googleUser.email });
        if (user && user.isBanned) {
            throw new UnauthorizedException('Tài khoản Google của bạn đã bị cấm.');
        }
        if (!user) {
            user = new this.usergoogleModel({
                uid: googleUser.sub,
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
            });
            await user.save();
        }
        return user;
    }

    async validateUser(email: string, plainTextPassword: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) return null;

        if (user.isBanned) {
            throw new UnauthorizedException('Tài khoản của bạn đã bị cấm.');
        }

        const passwordsMatch = await bcrypt.compare(plainTextPassword, user.password);
        if (passwordsMatch) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async createTokenForUser(user: any): Promise<string> {
        const payload = { email: user.email, sub: user._id };
        return this.jwtService.sign(payload);
    }
}
