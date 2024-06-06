/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module'; // Đảm bảo đường dẫn đúng

import { ProfileModule } from 'src/profile/profile.module';
import { ProfileSchema } from 'src/profile/entities/profile.entity';
import { Course, CourseSchema } from '../course/entities/course.entity';

@Module({
  imports: [
    forwardRef(() => ProfileModule),
    forwardRef(() => AuthModule),

    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Profile', schema: ProfileSchema },
      { name: Course.name, schema: CourseSchema }

    ]),

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
