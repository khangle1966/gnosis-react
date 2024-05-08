import * as firebaseAdmin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage'; // Nhập khẩu Bucket từ @google-cloud/storage
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './entities/image.entity';

@Injectable()
export class UploadService {
  private bucket: Bucket; // Sử dụng kiểu Bucket từ @google-cloud/storage

  constructor(@InjectModel(Image.name) private readonly imageModel: Model<Image>) {
    const firebaseParams = {
      type: "service_account",
      projectId: "gnosis-reactjs",
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!firebaseAdmin.apps.length) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseParams),
        storageBucket: 'gnosis-reactjs.appspot.com'
      });
    }
    this.bucket = firebaseAdmin.storage().bucket(); // Lấy bucket từ Firebase
  }

  async uploadToFirebase(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
        throw new Error("File is undefined or does not have a buffer.");
    }
    const filename = `uploads/${file.originalname}`;
    const fileRef = this.bucket.file(filename);
    await fileRef.save(file.buffer, {
        metadata: { contentType: file.mimetype },
    });
    const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    });
    return url;
}

async createImageRecord(file: Express.Multer.File): Promise<any> {
    if (!file) throw new Error("File is not provided.");

    const imageUrl = await this.uploadToFirebase(file);
    const newImage = new this.imageModel({
        url: imageUrl,
        filename: file.originalname,
        contentType: file.mimetype,
        size: file.size,
    });
    await newImage.save();
    return { url: imageUrl };
}
}
