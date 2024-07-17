import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { LessonService } from './lesson.service';

@Controller('v1/lesson')
export class LessonController {
  constructor(private lessonsService: LessonService) { }

  // Lấy bài học theo ID
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Lesson> {
    try {
      const lesson = await this.lessonsService.getById(id);
      return lesson;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy URL video của bài học theo lessonId
  @Get(':lessonId/videoUrl')
  async getVideoUrl(@Param('lessonId') lessonId: string): Promise<{ url: string }> {
    try {
      const videoUrl = await this.lessonsService.getVideoUrl(lessonId);
      return { url: videoUrl };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Tạo bài học mới
  @Post()
  async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    try {
      return await this.lessonsService.create(createLessonDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy tất cả các bài học
  @Get()
  async getAll(): Promise<Lesson[]> {
    try {
      const lessons = await this.lessonsService.getAll();
      return lessons;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Cập nhật bài học theo ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    try {
      const updatedLesson = await this.lessonsService.update(id, updateLessonDto);
      return updatedLesson;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Xóa bài học theo ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Lesson> {
    try {
      const deletedLesson = await this.lessonsService.delete(id);
      return deletedLesson;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy các bài học theo courseId
  @Get('course/:courseId')
  async getLessonsByCourseId(@Param('courseId') courseId: string): Promise<Lesson[]> {
    try {
      const lessons = await this.lessonsService.getLessonsByCourseId(courseId);
      return lessons;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy các bài học theo chapterId
  @Get('chapter/:chapterId')
  async getLessonsByChapterId(@Param('chapterId') chapterId: string): Promise<Lesson[]> {
    try {
      const lessons = await this.lessonsService.getLessonsByChapterId(chapterId);
      return lessons;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
