// upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Image, ImageSchema } from '../upload/entities/image.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    MulterModule.register({
      dest: './uploads', // Thư mục để lưu trữ tạm thời các tệp được tải lên
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule { }
