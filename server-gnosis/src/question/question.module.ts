import { Module, forwardRef } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

import { ProfileModule } from 'src/profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/question.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule { }
