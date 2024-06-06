import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UsergoogleModule } from '../usergoogle/usergoogle.module';
import { JwtStrategy } from './jwt.strategy'; // Import JwtStrategy

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    forwardRef(() => UserModule),
    forwardRef(() => UsergoogleModule),
  ],
  providers: [AuthService, JwtStrategy], // Đảm bảo JwtStrategy được thêm vào providers
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
