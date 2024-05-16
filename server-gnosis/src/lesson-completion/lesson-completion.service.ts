// src/lesson-completion/lesson-completion.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LessonCompletion, LessonCompletionDocument } from './entities/lesson-completion.entity';
import { CreateLessonCompletionDto } from './dto/create-lesson-completion.dto';

@Injectable()
export class LessonCompletionService {
  constructor(
    @InjectModel(LessonCompletion.name) private lessonCompletionModel: Model<LessonCompletionDocument>
  ) { }

  async create(createDto: CreateLessonCompletionDto): Promise<LessonCompletion> {
    const newRecord = new this.lessonCompletionModel(createDto);
    return newRecord.save();
  }

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

  async findByUserId(userId: string): Promise<LessonCompletion[]> {
    return this.lessonCompletionModel.find({ userId }).exec();
  }

  async getLessonCompletion(courseId: string, userId: string): Promise<LessonCompletion[]> {
    return this.lessonCompletionModel.find({ courseId, userId }).exec();
  }
}
