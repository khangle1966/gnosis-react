import { Module } from '@nestjs/common';
import { QuizBankService } from './quiz-bank.service';
import { QuizBankController } from './quiz-bank.controller';
import { QuizBank, QuizBankSchema } from './entities/quiz-bank.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizBank.name, schema: QuizBankSchema },
    ]),
  ],
  controllers: [QuizBankController],
  providers: [QuizBankService],
  exports: [QuizBankService],
})
export class QuizBankModule { }
