import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  // Tạo người dùng mới
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('hashedPassword khi tạo người dùng:', createUserDto.password);

    const createdUser = new this.userModel({
      ...createUserDto,
    });
    return createdUser.save();
  }

  // Tìm người dùng theo email
  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  // Cập nhật thông tin người dùng
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

  // Tìm người dùng theo email
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  // Xóa người dùng theo ID
  async remove(id: string): Promise<User | null> {
    try {
      return await this.userModel.findOneAndRemove({ uid: id });
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy tất cả người dùng
  async findAll(): Promise<User[]> {
    try {
      return this.userModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy dữ liệu người dùng theo tháng
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

  // Xóa người dùng theo UID
  async deleteByUid(uid: string): Promise<void> {
    const result = await this.userModel.findOneAndDelete({ uid }).exec();
    if (!result) {
      throw new NotFoundException(`User with UID "${uid}" not found`);
    }
  }

  // Cấm người dùng
  async banUser(uid: string): Promise<User> {
    try {
      const bannedUser = await this.userModel.findOneAndUpdate(
        { uid },
        { isBanned: true },
        { new: true },
      );
      return bannedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Hủy cấm người dùng
  async unbanUser(uid: string): Promise<User> {
    try {
      const unbannedUser = await this.userModel.findOneAndUpdate(
        { uid },
        { isBanned: false },
        { new: true },
      );
      return unbannedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
