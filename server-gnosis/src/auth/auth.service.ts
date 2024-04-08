import { Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service'; // Giả sử bạn đã có UserService
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Model } from 'mongoose';
import { UsergoogleService } from 'src/usergoogle/usergoogle.service';
import { Usergoogle } from 'src/usergoogle/entities/usergoogle.entity';
@Injectable()
export class AuthService {

    private jwksClient = jwksClient({
        jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    });


    constructor(
        @InjectModel('Usergoogle') private usergoogleModel: Model<Usergoogle>,

        private usergoogleService: UsergoogleService,
        private usersService: UserService,
        private jwtService: JwtService // Inject JwtService
    ) { }


    async verifyGoogleToken(idToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Lấy kid từ header của token
            const { header } = jwt.decode(idToken, { complete: true }) as any;

            // Lấy RSA key
            this.jwksClient.getSigningKey(header.kid, (err, key) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Xác thực token sử dụng key
                const signingKey = key.getPublicKey();
                jwt.verify(idToken, signingKey, { algorithms: ['RS256'] }, (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });
        });
    }
    async findOrCreateUser(userProfile: any): Promise<any> {
        // Giả sử userProfile có chứa một UID duy nhất từ Google
        const { uid, email, name, picture } = userProfile;

        let user = await this.usergoogleModel.findOne({ uid: uid });

        if (!user) {
            // Người dùng không tồn tại, tạo mới
            user = new this.usergoogleModel({
                uid,
                email,
                name,
                picture,
                // Bất kỳ thông tin nào khác bạn muốn lưu từ userProfile
            });

            await user.save();
        }

        return user;
    }
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    // Thêm phương thức mới cho việc xử lý đăng nhập Google


    async createTokenForUser(user: any): Promise<string> {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }


}