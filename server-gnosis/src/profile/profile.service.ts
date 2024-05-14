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
import { Model, Types } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';
import { UsergoogleService } from '../usergoogle/usergoogle.service'

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,

  ) { }
  private toUniqueObjectIds(ids: any[]): Types.ObjectId[] {
    return Array.from(new Set(ids.map(id => {
      if (typeof id === 'object' && id.hasOwnProperty('_id')) {
        id = id._id.toString();
      }
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException(`Invalid ObjectId: ${id}`, HttpStatus.BAD_REQUEST);
      }
      return new Types.ObjectId(id);
    })));
  }

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
      const currentProfile = await this.profileModel.findOne({ id });
      if (!currentProfile) {
        throw new NotFoundException(`Profile with id ${id} not found.`);
      }

      // Convert to unique ObjectIds and ensure no duplicates
      const uniqueCourses = this.toUniqueObjectIds([
        ...(currentProfile.courses || []).map(course => course.toString()),
        ...(updateProfileDto.courses || [])
      ]);

      const uniqueCompletedCourses = this.toUniqueObjectIds([
        ...(currentProfile.completedCourse || []).map(course => course.toString()),
        ...(updateProfileDto.completedCourse || [])
      ]);

      const uniqueOngoingCourses = this.toUniqueObjectIds([
        ...(currentProfile.ongoingCourse || []).map(course => course.toString()),
        ...(updateProfileDto.ongoingCourse || [])
      ]);

      // Ensure unique ObjectIds for each course type
      const updatedProfileData = {
        ...updateProfileDto,
        courses: Array.from(new Set(uniqueCourses.map(id => id.toString()))),
        completedCourse: Array.from(new Set(uniqueCompletedCourses.map(id => id.toString()))),
        ongoingCourse: Array.from(new Set(uniqueOngoingCourses.map(id => id.toString()))),
      };

      const updatedProfile = await this.profileModel.findOneAndUpdate(
        { id },
        { $set: updatedProfileData },
        { new: true }
      );

      if (!updatedProfile) {
        throw new NotFoundException(`Profile with id ${id} not found.`);
      }

      return updatedProfile;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
