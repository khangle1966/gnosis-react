import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter, ChapterDocument } from '../chapter/entities/chapter.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
  ) { }

  // Tạo bài học mới
  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const { chapterId, ...lessonDetails } = createLessonDto;

    try {
      const chapter = await this.chapterModel.findById(chapterId);
      if (!chapter) {
        throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
      }

      const lesson = new this.lessonModel({
        ...lessonDetails,
        chapterId: chapter._id, // Đảm bảo lưu chapterId với bài học
      });

      chapter.lessons.push(lesson._id);
      await chapter.save();

      return await lesson.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy bài học theo ID
  async getById(id: string): Promise<Lesson> {
    try {
      return await this.lessonModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy tất cả các bài học
  async getAll(): Promise<Lesson[]> {
    try {
      return await this.lessonModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Cập nhật bài học theo ID
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

  // Xóa bài học theo ID
  async delete(id: string): Promise<Lesson> {
    try {
      const deletedLesson = await this.lessonModel.findByIdAndDelete(id);
      return deletedLesson;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy các bài học theo courseId
  async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    try {
      return await this.lessonModel.find({ courseId }).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy các bài học theo chapterId
  async getLessonsByChapterId(chapterId: string): Promise<Lesson[]> {
    try {
      return await this.lessonModel.find({ chapterId }).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy các bài học theo ordinal number
  async getLessonsByOrdinalNumber(ordinalnumber: number): Promise<Lesson[]> {
    try {
      return await this.lessonModel.find({ ordinalnumber }).populate('courseId').exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy các bài học theo courseId và ordinal number
  async getLessonsByCourseIdAndOrdinalNumber(courseId: string, ordinalnumber: number): Promise<Lesson[]> {
    try {
      return await this.lessonModel.find({ courseId, ordinalnumber }).populate('courseId').exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy URL video của bài học theo lessonId
  async getVideoUrl(lessonId: string): Promise<string> {
    try {
      const lesson = await this.lessonModel.findById(lessonId);
      if (!lesson) {
        throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
      }
      return lesson.videoUrl;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
