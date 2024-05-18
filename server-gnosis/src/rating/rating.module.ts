// src/rating/rating.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { Rating, RatingSchema } from './entities/rating.entity';
import { Course, CourseSchema } from '../course/entities/course.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]), // Import Course schema if needed
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule { }
