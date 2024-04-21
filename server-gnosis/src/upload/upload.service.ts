// upload.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './entities/image.entity';

@Injectable()
export class UploadService {
    constructor(@InjectModel(Image.name) private readonly imageModel: Model<Image>) {}

    async createImageRecord(file: Express.Multer.File): Promise<any> {
        const imageUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;
        const newImage = new this.imageModel({
            url: imageUrl,
            filename: file.filename,
            contentType: file.mimetype,
            size: file.size,
        });
        await newImage.save();
        return { url: imageUrl };
    }
}
