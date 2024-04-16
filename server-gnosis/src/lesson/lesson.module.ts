// src/lesson/lesson.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { Lesson, LessonSchema } from './entities/lesson.entity';
import { Chapter, ChapterSchema } from '../chapter/entities/chapter.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }])
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule { }
