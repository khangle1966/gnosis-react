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
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter> // Inject Chapter model here
  ) { }
  // src/lesson/lesson.service.ts




  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const { chapterId, ...lessonDetails } = createLessonDto;

    try {
      const chapter = await this.chapterModel.findById(chapterId);
      if (!chapter) {
        throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
      }

      // Include chapterId in the lesson creation to ensure it's saved in the database
      const lesson = new this.lessonModel({
        ...lessonDetails,
        chapterId: chapter._id // Ensuring chapterId is saved with the lesson
      });

      chapter.lessons.push(lesson._id);
      await chapter.save();

      return await lesson.save();
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
  async getLessonsByChapterId(chapterId: string): Promise<Lesson[]> {
    try {
      //populate nestjs object mongoose
      return await this.lessonModel.find({ chapterId: chapterId }).exec();
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
