import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity'; // Đảm bảo đường dẫn đến User schema đúng
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Sử dụng InjectModel cho Mongoose
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { uid: id },
        { ...updateUserDto },
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async remove(id: string): Promise<User | null> {
    try {
      return await this.userModel.findOneAndRemove({ uid: id });
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.userModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getMonthlyData(): Promise<any[]> {
    const users = await this.userModel.find().exec();
    const monthlyData = {};

    users.forEach(user => {
      const month = moment(user.createdAt).format('YYYY-MM');
      if (!monthlyData[month]) {
        monthlyData[month] = { month, userCount: 0 };
      }
      monthlyData[month].userCount += 1;
    });

    return Object.values(monthlyData);
  }
}
