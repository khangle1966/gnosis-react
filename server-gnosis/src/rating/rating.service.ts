import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) { }

  // Tạo đánh giá mới
  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    const createdRating = new this.ratingModel(createRatingDto);
    const rating = await createdRating.save();
    await this.updateCourseRating(rating.courseId); // Cập nhật đánh giá trung bình của khóa học
    return rating;
  }

  // Tìm đánh giá theo courseId
  async findByCourseId(courseId: string): Promise<Rating[]> {
    return this.ratingModel.find({ courseId }).exec();
  }

  // Cập nhật đánh giá trung bình của khóa học
  private async updateCourseRating(courseId: Types.ObjectId) {
    const ratings = await this.ratingModel.find({ courseId }).exec();
    const avgRating = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;
    await this.courseModel.findByIdAndUpdate(courseId, { rating: avgRating });
  }
}
