import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUsergoogleDto } from './dto/create-usergoogle.dto';
import { UpdateUsergoogleDto } from './dto/update-usergoogle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usergoogle } from './entities/usergoogle.entity';
import { Profile } from '../profile/entities/profile.entity';
@Injectable()
export class UsergoogleService {
  constructor(@InjectModel(Usergoogle.name) private usergoogleModel: Model<Usergoogle>) { }

  async create(createUserDto: CreateUsergoogleDto): Promise<Usergoogle> {
    try {
      const newUser = new this.usergoogleModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<Usergoogle> {
    try {
      const userData = await this.usergoogleModel.findOne({ uid: id });
      return userData;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateUserDto: UpdateUsergoogleDto): Promise<Usergoogle> {
    try {

      const updatedUser = await this.usergoogleModel.findOneAndUpdate(
        { uid: id },
        { ...updateUserDto },
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.usergoogleModel.findOneAndRemove({ uid: id });
      return deletedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  
  findAll() {
    try {
      const users = this.usergoogleModel.find();
      return users;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

