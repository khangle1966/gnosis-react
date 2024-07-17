import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) { }

  // Tạo đánh giá mới
  @Post()
  async create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(createRatingDto);
  }

  // Tìm đánh giá theo courseId
  @Get(':courseId')
  async findByCourseId(@Param('courseId') courseId: string) {
    return this.ratingService.findByCourseId(courseId);
  }
}
