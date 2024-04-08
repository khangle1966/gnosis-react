import { Module, forwardRef } from '@nestjs/common';
import { UsergoogleService } from './usergoogle.service';
import { UsergoogleController } from './usergoogle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from 'src/profile/profile.module';
import { ProfileSchema } from 'src/profile/entities/profile.entity';
import { UsergoogleSchema, Usergoogle } from './entities/usergoogle.entity';
import { AuthModule } from '../auth/auth.module'; // Đảm bảo đường dẫn đúng

@Module({
  imports: [

    forwardRef(() => ProfileModule),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: Usergoogle.name, schema: UsergoogleSchema },
      { name: 'Profile', schema: ProfileSchema },
    ]),

  ],
  controllers: [UsergoogleController],
  providers: [UsergoogleService],
  exports: [UsergoogleService, MongooseModule],
})
export class UsergoogleModule { }
