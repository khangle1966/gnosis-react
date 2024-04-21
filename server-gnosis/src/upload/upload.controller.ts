import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',  // Thư mục lưu trữ
      filename: (_req, file, cb) => {
        const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + new Date().getTime();
        const extension: string = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`)
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadService.createImageRecord(file);
    return response;
  }
}
