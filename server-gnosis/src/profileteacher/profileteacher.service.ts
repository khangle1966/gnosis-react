import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProfileteacherDto } from './dto/create-profileteacher.dto';
import { UpdateProfileteacherDto } from './dto/update-profileteacher.dto';
import { Profileteacher, ProfileteacherDocument } from './entities/profileteacher.entity';

@Injectable()
export class ProfileteacherService {
  constructor(@InjectModel(Profileteacher.name) private profileteacherModel: Model<ProfileteacherDocument>) { }

  async create(createProfileteacherDto: CreateProfileteacherDto): Promise<any> {
    try {
      const newProfileteacher = new this.profileteacherModel(createProfileteacherDto);
      await newProfileteacher.save();
      return newProfileteacher;
    } catch (error) {
      console.error(error); // Log the error to the console or your preferred logger
      throw new InternalServerErrorException(error.message); // Or return a custom error message
    }
  }

  async findAll(): Promise<Profileteacher[]> {
    return this.profileteacherModel.find().exec();
  }

  async findOne(id: string): Promise<Profileteacher> {
    return this.profileteacherModel.findById(id).exec();
  }

  async update(id: string, updateProfileteacherDto: UpdateProfileteacherDto): Promise<Profileteacher> {
    return this.profileteacherModel.findByIdAndUpdate(id, updateProfileteacherDto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.profileteacherModel.findByIdAndRemove(id).exec();
  }
}
