import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileteacherController } from './profileteacher.controller';
import { ProfileteacherService } from './profileteacher.service';
import { Profileteacher, ProfileteacherSchema } from './entities/profileteacher.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profileteacher.name, schema: ProfileteacherSchema }])
  ],
  controllers: [ProfileteacherController],
  providers: [ProfileteacherService],
})
export class ProfileteacherModule { }
