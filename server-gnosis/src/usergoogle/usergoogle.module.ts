import { Module, forwardRef } from '@nestjs/common';
import { UsergoogleService } from './usergoogle.service';
import { UsergoogleController } from './usergoogle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from 'src/profile/profile.module';
import { ProfileSchema } from 'src/profile/entities/profile.entity';
import { UsergoogleSchema, Usergoogle } from './entities/usergoogle.entity';
import { AuthModule } from '../auth/auth.module'; // Đảm bảo đường dẫn đúng
import { Course, CourseSchema } from '../course/entities/course.entity';

@Module({
  imports: [

    forwardRef(() => ProfileModule),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: Usergoogle.name, schema: UsergoogleSchema },
      { name: 'Profile', schema: ProfileSchema },
      { name: Course.name, schema: CourseSchema }

    ]),

  ],
  controllers: [UsergoogleController],
  providers: [UsergoogleService],
  exports: [UsergoogleService, MongooseModule],
})
export class UsergoogleModule { }
