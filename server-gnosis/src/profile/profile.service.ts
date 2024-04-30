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
      const profile = new this.profileModel(createProfileDto);
      console.log(profile);
      return await profile.save();
    } catch (error) {
      console.log(error);
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
        if (updateProfileDto.courses) {
            const currentProfile = await this.profileModel.findOne({ id: id });
            if (!currentProfile) {
                throw new NotFoundException(`Profile with id ${id} not found.`);
            }

            // Chuyển đổi ID của khóa học thành chuỗi
            const currentCourseIds = currentProfile.courses.map(course => course.toString());
            const newCourseIds = updateProfileDto.courses;
            const uniqueCourses = Array.from(new Set([...currentCourseIds, ...newCourseIds]));
            updateProfileDto.courses = uniqueCourses; // Giữ nguyên dạng chuỗi
        }

        const updatedProfile = await this.profileModel.findOneAndUpdate(
            { id: id },
            { $set: updateProfileDto },
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
