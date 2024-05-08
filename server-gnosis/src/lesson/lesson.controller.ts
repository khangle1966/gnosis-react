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

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Lesson> {
    try {
      const lesson = await this.lessonsService.getById(id);
      return lesson;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Get(':lessonId/videoUrl') // Corrected the route
  async getVideoUrl(@Param('lessonId') lessonId: string): Promise<{ url: string }> {
    try {
      const videoUrl = await this.lessonsService.getVideoUrl(lessonId);
      return { url: videoUrl };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  @Post()
  async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    try {
      return await this.lessonsService.create(createLessonDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  @Get()
  async getAll(): Promise<Lesson[]> {
    try {
      const lessons = await this.lessonsService.getAll();
      return lessons;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    try {
      const updatedLesson = await this.lessonsService.update(
        id,
        updateLessonDto,
      );
      return updatedLesson;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Lesson> {
    try {
      const deletedLesson = await this.lessonsService.delete(id);
      return deletedLesson;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('course/:courseId')
  async getLessonsByCourseId(
    @Param('courseId') courseId: string,
  ): Promise<Lesson[]> {
    try {
      const lessons = await this.lessonsService.getLessonsByCourseId(courseId);
      return lessons;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Get('chapter/:chapterId')
  async getLessonsByChapterId(
    @Param('chapterId') chapterId: string,
  ): Promise<Lesson[]> {
    try {
      const lessons = await this.lessonsService.getLessonsByChapterId(chapterId);
      return lessons;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

}
