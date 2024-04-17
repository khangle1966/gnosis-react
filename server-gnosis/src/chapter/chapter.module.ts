// src/chapter/chapter.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { Chapter, ChapterSchema } from './entities/chapter.entity';
import { LessonModule } from '../lesson/lesson.module'; // Import the LessonModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    LessonModule, // Import LessonModule here

  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService] // Xuất ChapterService nếu cần sử dụng ở nơi khác
})
export class ChapterModule { }
