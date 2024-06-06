import { Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
          throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }
      const response = await this.uploadService.createImageRecord(file);
      return response;
  }
  @Post('video')
  @UseInterceptors(FileInterceptor('video', { storage: memoryStorage() }))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
          throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }
      const response = await this.uploadService.createVideoRecord(file);
      return response;
  }
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    const response = await this.uploadService.createImageRecord(file);
    return response;
  }
}
