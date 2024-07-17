import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constants'; // Import constants

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy JWT từ header Authorization
            secretOrKey: jwtConstants.secret, // Sử dụng giá trị từ constants
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
