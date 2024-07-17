import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LessonCompletion, LessonCompletionDocument } from './entities/lesson-completion.entity';
import { CreateLessonCompletionDto } from './dto/create-lesson-completion.dto';

@Injectable()
export class LessonCompletionService {
  constructor(
    @InjectModel(LessonCompletion.name) private lessonCompletionModel: Model<LessonCompletionDocument>
  ) { }

  // Tạo bản ghi hoàn thành bài học mới
  async create(createDto: CreateLessonCompletionDto): Promise<LessonCompletion> {
    const newRecord = new this.lessonCompletionModel(createDto);
    return newRecord.save();
  }

  // Đánh dấu bài học là đã hoàn thành
  async markAsComplete(lessonId: string, userId: string, courseId: string): Promise<LessonCompletion> {
    const existingRecord = await this.lessonCompletionModel.findOne({ lessonId, userId, courseId });

    if (existingRecord) {
      existingRecord.completed = true;
      return await existingRecord.save();
    } else {
      const newRecord = new this.lessonCompletionModel({
        userId,
        lessonId,
        courseId,
        completed: true
      });
      return await newRecord.save();
    }
  }

  // Lấy các bản ghi hoàn thành bài học của người dùng theo userId
  async findByUserId(userId: string): Promise<LessonCompletion[]> {
    return this.lessonCompletionModel.find({ userId }).exec();
  }

  // Lấy các bản ghi hoàn thành bài học của người dùng theo courseId và userId
  async getLessonCompletion(courseId: string, userId: string): Promise<LessonCompletion[]> {
    return this.lessonCompletionModel.find({ courseId, userId }).exec();
  }
}
