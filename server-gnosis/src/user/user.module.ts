/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';

import { ProfileModule } from 'src/profile/profile.module';
import { ProfileSchema } from 'src/profile/entities/profile.entity';

@Module({
  imports: [
    forwardRef(() => ProfileModule),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Profile', schema: ProfileSchema },
    ]),

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
