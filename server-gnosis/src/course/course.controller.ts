/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Profile } from 'src/profile/entities/profile.entity';
import { Course } from './entities/course.entity';

@Controller('v1/course')
export class CourseController {
  constructor(private courseService: CourseService) { }

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    const requiredFields = ['name'];
    const missingFields = requiredFields.filter(
      (field) => !createCourseDto[field],
    );
    if (missingFields.length > 0) {
      throw new HttpException(
        `Missing required fields: ${missingFields.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const createCourse = await this.courseService.create(createCourseDto);
      return createCourse;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll(): Promise<Course[]> {
    try {
      const courses = await this.courseService.findAll();
      return courses;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post('userCourses')
  async getUserCourses(@Body('courseIds') courseIds: string[]) {
    const courses = await this.courseService.findCoursesByIds(courseIds);
    return courses;
  }
  @Get(':id')
  async getCourse(@Param('id') id: string): Promise<Course> {
    return this.courseService.getCourse(id);
  }

  @Patch(':id/rating')
  async updateRating(
    @Param('id') id: string,
    @Body('rating') rating: number,
  ): Promise<Course> {
    try {
      return await this.courseService.updateRating(id, rating);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    try {
      const course = await this.courseService.update(id, updateCourseDto);
      return course;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Course> {
    try {
      const course = await this.courseService.remove(id);
      return course;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id/buy')
  async buyCourse(
    @Param('id') courseId: string,
    //id == ObjectId
    @Query('uid') userId: string,
    //uid == idProfile
  ): Promise<Profile> {
    try {
      const profile = await this.courseService.buyCourse(courseId, userId);
      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('user/:id')
  async getProfileCourses(@Param('id') id: string): Promise<Course[]> {
    try {
      const courses = await this.courseService.getCourseByUserId(id);
      return courses;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
