// src/videos/videos.module.ts hoặc module tương ứng
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Image, ImageSchema } from './entities/image.entity';
import { Video, VideoSchema } from './entities/video.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Image.name, schema: ImageSchema },
      { name: Video.name, schema: VideoSchema }
    ])
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
