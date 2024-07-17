import * as firebaseAdmin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './entities/image.entity';
import { Video } from './entities/video.entity';

@Injectable()
export class UploadService {
  private bucket: Bucket;

  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    @InjectModel(Video.name) private readonly videoModel: Model<Video>
  ) {
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
    this.bucket = firebaseAdmin.storage().bucket();
  }

  // Tải file lên Firebase
  async uploadToFirebase(file: Express.Multer.File, directory: string = 'uploads'): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error("File is undefined or does not have a buffer.");
    }
    try {
      const filename = `${directory}/${Date.now()}-${file.originalname}`;
      const fileRef = this.bucket.file(filename);
      await fileRef.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });

      const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: Date.now() + 86400 * 1000, // 1 day in the future
      });

      return url;
    } catch (error) {
      console.error('Failed to upload to Firebase:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  // Tạo bản ghi hình ảnh
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

  // Tạo bản ghi video
  async createVideoRecord(file: Express.Multer.File): Promise<any> {
    if (!file) throw new Error("File is not provided.");

    const videoUrl = await this.uploadToFirebase(file, 'videos');
    const newVideo = new this.videoModel({
      url: videoUrl,
      filename: file.originalname,
      contentType: file.mimetype,
      size: file.size,
    });
    await newVideo.save();
    return { url: videoUrl };
  }
}
