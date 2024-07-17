import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LessonCompletionService } from './lesson-completion.service';
import { CreateLessonCompletionDto } from './dto/create-lesson-completion.dto';

@Controller('lesson-completion')
export class LessonCompletionController {
  constructor(private readonly lessonCompletionService: LessonCompletionService) { }

  // Tạo bản ghi hoàn thành bài học mới
  @Post()
  async create(@Body() createDto: CreateLessonCompletionDto) {
    return this.lessonCompletionService.create(createDto);
  }

  // Đánh dấu bài học là đã hoàn thành
  @Post('complete')
  async markAsComplete(@Body() body: { lessonId: string; userId: string; courseId: string }) {
    return this.lessonCompletionService.markAsComplete(body.lessonId, body.userId, body.courseId);
  }

  // Lấy các bản ghi hoàn thành bài học của người dùng theo userId
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.lessonCompletionService.findByUserId(userId);
  }

  // Lấy các bản ghi hoàn thành bài học của người dùng theo courseId và userId
  @Get('course/:courseId/user/:userId')
  async getLessonCompletion(@Param('courseId') courseId: string, @Param('userId') userId: string) {
    return this.lessonCompletionService.getLessonCompletion(courseId, userId);
  }
}
