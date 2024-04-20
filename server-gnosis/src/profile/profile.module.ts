import { Module, forwardRef } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './entities/profile.entity';
import { UserModule } from 'src/user/user.module';
import { UsergoogleModule } from 'src/usergoogle/usergoogle.module';

import { CourseSchema } from 'src/course/entities/course.entity';

@Module({
  imports: [
    forwardRef(() => UsergoogleModule),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),

  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule { }
