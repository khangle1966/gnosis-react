// src/lesson-completion/lesson-completion.controller.ts

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LessonCompletionService } from './lesson-completion.service';
import { CreateLessonCompletionDto } from './dto/create-lesson-completion.dto';

@Controller('lesson-completion')
export class LessonCompletionController {
  constructor(private readonly lessonCompletionService: LessonCompletionService) { }

  @Post()
  async create(@Body() createDto: CreateLessonCompletionDto) {
    return this.lessonCompletionService.create(createDto);
  }

  @Post('complete')
  async markAsComplete(@Body() body: { lessonId: string; userId: string; courseId: string }) {
    return this.lessonCompletionService.markAsComplete(body.lessonId, body.userId, body.courseId);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.lessonCompletionService.findByUserId(userId);
  }

  @Get('course/:courseId/user/:userId')
  async getLessonCompletion(@Param('courseId') courseId: string, @Param('userId') userId: string) {
    return this.lessonCompletionService.getLessonCompletion(courseId, userId);
  }
}
