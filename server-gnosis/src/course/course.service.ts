/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './entities/course.entity';
import { Model } from 'mongoose';
import { Profile } from 'src/profile/entities/profile.entity';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const newCourse = new this.courseModel(createCourseDto);
      return await newCourse.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(): Promise<Course[]> {
    try {
      return await this.courseModel.find({}).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<Course> {
    try {
      return await this.courseModel.findById(id).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const updateCourse = await this.courseModel.findOneAndUpdate(
        { _id: id },
        { ...updateCourseDto },
        { new: true },
      );
      return updateCourse;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: string): Promise<Course> {
    try {
      const course = await this.courseModel.findById(id); // Tìm đối tượng trước
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      await this.courseModel.deleteOne({ _id: id }); // Sau đó xóa đối tượng
      return course; // Trả về đối tượng đã tìm được
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async buyCourse(courseId: string, userId: string): Promise<Profile> {
    const filter = { id: userId };
    const update = { $addToSet: { courses: courseId } };
    const options = { new: true, upsert: false };

    const profile = await this.profileModel.findOneAndUpdate(
      filter,
      update,
      options,
    );
    return profile;
  }

  async getCourseByUserId(userId: string): Promise<Course[]> {
    try {
      const profile = await this.profileModel.findOne({ id: userId });
      const courses = await this.courseModel.find({
        _id: { $nin: profile.courses },
        isReleased: true,
      });
      return courses;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
