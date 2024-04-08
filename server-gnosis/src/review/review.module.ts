import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './entities/review.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: 'QuizBank', schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: 'Quiz', schema: ReviewSchema }]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule { }
