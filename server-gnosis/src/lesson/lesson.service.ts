import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LessonService {
  createLesson(createLessonDto: CreateLessonDto) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    try {
      const newLesson = new this.lessonModel({
        ...createLessonDto,
      });
      return await newLesson.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getById(id: string): Promise<Lesson> {
    try {
      return await this.lessonModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getAll(): Promise<Lesson[]> {
    try {
      return await this.lessonModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    try {
      return this.lessonModel.findByIdAndUpdate(
        { _id: id },
        { ...updateLessonDto },
        { new: true },
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async delete(id: string): Promise<Lesson> {
    try {
      const deletedLesson = await this.lessonModel.findByIdAndDelete(id);
      return deletedLesson;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    try {
      //populate nestjs object mongoose
      return await this.lessonModel.find({ courseId: courseId }).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //how to get all lessons by given ordinal number
  async getLessonsByOrdinalNumber(ordinalnumber: number): Promise<Lesson[]> {
    try {
      return await this.lessonModel
        .find({ ordinalnumber: ordinalnumber })
        .populate('courseId')
        .exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //else
  async getLessonsByCourseIdAndOrdinalNumber(
    courseId: string,
    ordinalnumber: number,
  ): Promise<Lesson[]> {
    try {
      return await this.lessonModel
        .find({ courseId: courseId, ordinalnumber: ordinalnumber })
        .populate('courseId')
        .exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
