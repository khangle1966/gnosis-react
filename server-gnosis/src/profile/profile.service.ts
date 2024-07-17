import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';

import * as mongoose from 'mongoose'; // Import mongoose

import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';
import { UsergoogleService } from '../usergoogle/usergoogle.service'

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Course.name) private courseModel: Model<Course>, // Inject Course model


  ) { }


  async createProfileForUserGoogle(createProfileDto: CreateProfileDto): Promise<Profile> {
    try {
      const profile = new this.profileModel(createProfileDto);
      console.log(profile);
      return await profile.save();
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    try {
      // Ensure unique IDs in courses, completedCourse, and ongoingCourse
      createProfileDto.courses = Array.from(new Set(createProfileDto.courses));
      createProfileDto.completedCourse = Array.from(new Set(createProfileDto.completedCourse));
      createProfileDto.ongoingCourse = Array.from(new Set(createProfileDto.ongoingCourse));

      const profile = new this.profileModel(createProfileDto);
      return await profile.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getProfileStats(id: string): Promise<any> {
    try {
      const profile = await this.profileModel.findOne({ id }).exec();
      if (!profile) {
        throw new NotFoundException(`Profile with id ${id} not found.`);
      }

      const courses = await this.courseModel.find({ authorId: profile.id }).exec();
      const totalStudents = courses.reduce((sum, course) => sum + course.numberOfStudents, 0);
      const totalRating = courses.reduce((sum, course) => sum + course.rating, 0);

      return {
        totalStudents,
        totalRating,
        totalCourses: courses.length,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async findOne(id: string): Promise<Profile> {
    try {
      const profile = await this.profileModel
        .findOne({ id: id })
        .select('-createdAt -updatedAt -__v')
        .populate(
          'courses completedCourse ongoingCourse',
          // 'ongoingCourse',
          '-createdAt -updatedAt -__v ',
        );
      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    try {
      const currentProfile = await this.profileModel.findOne({ id: id });
      if (!currentProfile) {
        throw new NotFoundException(`Profile with id ${id} not found.`);
      }

      // Ensure unique IDs in courses, completedCourse, and ongoingCourse
      let uniqueCourses = Array.from(new Set([
        ...(currentProfile.courses || []).map(course => course.toString()),
        ...(updateProfileDto.courses || [])
      ]));

      let uniqueCompletedCourses = Array.from(new Set([
        ...(currentProfile.completedCourse || []).map(course => course.toString()),
        ...(updateProfileDto.completedCourse || [])
      ]));

      let uniqueOngoingCourses = Array.from(new Set([
        ...(currentProfile.ongoingCourse || []).map(course => course.toString()),
        ...(updateProfileDto.ongoingCourse || [])
      ]));

      // Convert ObjectId arrays to string arrays
      uniqueCourses = uniqueCourses.map(id => id.toString());
      uniqueCompletedCourses = uniqueCompletedCourses.map(id => id.toString());
      uniqueOngoingCourses = uniqueOngoingCourses.map(id => id.toString());

      const updatedProfile = await this.profileModel.findOneAndUpdate(
        { id: id },
        {
          $set: {
            ...updateProfileDto,
            courses: uniqueCourses,
            completedCourse: uniqueCompletedCourses,
            ongoingCourse: uniqueOngoingCourses,
          }
        },
        { new: true }
      );
      if (!updatedProfile) {
        throw new NotFoundException(`Profile with id ${id} not found.`);
      }
      return updatedProfile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async addCoursesToUserProfile(userId: string, courseIds: string[]): Promise<void> {
    await this.profileModel.updateOne(
      { id: userId }, // Sử dụng 'id' để tìm kiếm người dùng
      { $addToSet: { courses: { $each: courseIds.map(id => new mongoose.Types.ObjectId(id)) } } } // Thêm các khóa học vào mảng courses
    ).exec();
  }

  async remove(id: string) {
    try {
      const deletedProfile = await this.profileModel.findOneAndDelete({
        _id: id,
      });
      return deletedProfile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async findAll(): Promise<Profile[]> {
    try {
      return await this.profileModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  getAllCourseOfProfile(id: string): Promise<Profile> {
    try {
      const profile = this.profileModel
        .findOne({ _id: id })
        .select('-createdAt -updatedAt -__v')
        .populate('completeCourse', '-createdAt -updatedAt -__v ')
        .then((profile) => {
          return profile;
        });
      return profile;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async findByEmail(email: string): Promise<boolean> {
    try {
      // Tìm profile theo email
      const profile = await this.profileModel.findOne({ email }).exec();

      // Nếu không tìm thấy profile, trả về false
      if (!profile) {
        return false;
      }

      // Nếu tìm thấy profile, trả về true
      return true;
    } catch (error) {
      // Xử lý ngoại lệ nếu có lỗi xảy ra
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
