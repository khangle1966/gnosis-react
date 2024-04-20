// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsergoogleModule } from '../usergoogle/usergoogle.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'yourSecretKey',
      signOptions: { expiresIn: '60s' },
    }),
    forwardRef(() => UsergoogleModule),

    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Xuất khẩu AuthService
  controllers: [AuthController],
})
export class AuthModule { }
