// src/lesson-completion/lesson-completion.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonCompletionService } from './lesson-completion.service';
import { LessonCompletionController } from './lesson-completion.controller';
import { LessonCompletion, LessonCompletionSchema } from './entities/lesson-completion.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LessonCompletion.name, schema: LessonCompletionSchema }])
  ],
  controllers: [LessonCompletionController],
  providers: [LessonCompletionService],
})
export class LessonCompletionModule { }
