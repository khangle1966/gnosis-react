import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpException } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('v1/review')
export class ReviewController {
  constructor(private reviewService: ReviewService) { }
  // @Post()
  // create(@Body() createReviewDto: CreateReviewDto) {
  //   try {
  //     const createReview = this.reviewService.create(createReviewDto);
  //     return createReview;
  //   }
  //   catch (error) {
  //     throw new HttpException(error.message, error.status);
  //   }
  // }

  @Post('compare')
  async compareAnswer(@Body() data: any) {
    try {
      const compare = await this.reviewService.compareAnswer(data);
      return compare;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Put('redo/:id')
  async redoReview(@Param('id') id: string, @Body() data: UpdateReviewDto) {
    try {

      const redo = await this.reviewService.redoReview(id, data);

      return redo;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }



  @Get()
  async findAll() {
    try {
      const review = await this.reviewService.findAll();
      return review;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const review = await this.reviewService.findOneByQuizId(id);
      return review;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.reviewService.update(id, updateReviewDto);
      return review;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const review = await this.reviewService.remove(id);
      return review;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
