import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUsergoogleDto } from './dto/create-usergoogle.dto';
import { UpdateUsergoogleDto } from './dto/update-usergoogle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usergoogle, UserDocument } from './entities/usergoogle.entity';
import { Course, CourseDocument } from '../course/entities/course.entity';
import * as moment from 'moment';

@Injectable()
export class UsergoogleService {
  constructor(
    @InjectModel(Usergoogle.name) private readonly usergoogleModel: Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) { }

  // Tạo một người dùng mới
  async create(createUserDto: CreateUsergoogleDto): Promise<Usergoogle> {
    try {
      const newUser = new this.usergoogleModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Cập nhật cấp độ giảng viên của người dùng
  async updateInstructorLevel(uid: string): Promise<void> {
    const user = await this.usergoogleModel.findOne({ uid }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const courses = await this.courseModel.find({ authorId: user.uid }).exec();
    let totalRating = 0;
    let totalStudents = 0;

    courses.forEach(course => {
      totalRating += course.rating;
      totalStudents += course.numberOfStudents;
    });

    console.log("Total Rating:", totalRating); // Kiểm tra tổng số đánh giá
    console.log("Total Students:", totalStudents); // Kiểm tra tổng số học viên
    console.log("Number of Courses:", courses.length); // Kiểm tra số lượng khóa học

    const averageRating = totalRating / (courses.length || 1); // Tránh chia cho 0
    console.log("Average Rating:", averageRating); // Kiểm tra đánh giá trung bình

    const newLevel = Course.calculateInstructorLevel(averageRating, totalStudents);
    console.log("New Level Instructors:", newLevel); // Kiểm tra cấp bậc mới

    await this.usergoogleModel.findByIdAndUpdate(user._id, { instructorLevel: newLevel }).exec();
  }

  // Tìm người dùng theo UID
  async findByUid(uid: string): Promise<Usergoogle> {
    try {
      const userData = await this.usergoogleModel.findOne({ uid }).exec();
      return userData;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Tìm người dùng theo ID
  async findOne(id: string): Promise<Usergoogle> {
    try {
      const userData = await this.usergoogleModel.findOne({ uid: id });
      return userData;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Cập nhật thông tin người dùng
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

  // Xóa người dùng
  async remove(id: string) {
    try {
      const deletedUser = await this.usergoogleModel.findOneAndRemove({ uid: id });
      return deletedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy tất cả người dùng
  findAll() {
    try {
      const users = this.usergoogleModel.find();
      return users;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Lấy dữ liệu người dùng theo tháng
  async getMonthlyDataUser(): Promise<any[]> {
    const users = await this.usergoogleModel.find().exec();
    const monthlyData = {};

    users.forEach(user => {
      const month = moment(user.createdAt).format('YYYY-MM');
      if (!monthlyData[month]) {
        monthlyData[month] = { month, count: 0 };
      }
      monthlyData[month].count += 1;
    });

    return Object.values(monthlyData);
  }

  // Lấy dữ liệu khóa học theo tháng của người dùng
  async getMonthlyData(uid: string): Promise<any[]> {
    const courses = await this.courseModel.find({ authorId: uid }).exec();
    const monthlyData = {};

    courses.forEach(course => {
      const month = new Date(course.publishedDate).getMonth() + 1;
      const year = new Date(course.publishedDate).getFullYear();
      const key = `${year}-${month}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { month: key, students: 0 };
      }

      monthlyData[key].students += course.numberOfStudents;
    });

    const result = Object.values(monthlyData);
    console.log(result); // Thêm dòng này để kiểm tra dữ liệu trả về
    return result;
  }

  // Lấy tất cả giảng viên
  async findAllInstructors(): Promise<Usergoogle[]> {
    const instructors = await this.usergoogleModel.find({ role: 'instructor' }).exec();
    const instructorData = await Promise.all(
      instructors.map(async (instructor) => {
        const courses = await this.courseModel.find({ authorId: instructor.uid }).exec();
        const totalStudents = courses.reduce((sum, course) => sum + course.numberOfStudents, 0);
        return {
          ...instructor.toObject(),
          totalStudents,
        };
      })
    );
    return instructorData;
  }

  // Lấy cấp độ giảng viên của người dùng
  async getInstructorLevel(uid: string): Promise<string> {
    const user = await this.usergoogleModel.findOne({ uid }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.instructorLevel;
  }

  // Cập nhật URL ảnh của người dùng
  async updatePicUrl(userId: string, picUrl: string): Promise<Usergoogle> {
    try {
      const user = await this.usergoogleModel.findOneAndUpdate(
        { uid: userId },
        { picture: picUrl },
        { new: true }
      );
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Cấm người dùng
  async banUser(id: string) {
    try {
      const bannedUser = await this.usergoogleModel.findOneAndUpdate(
        { uid: id },
        { isBanned: true },
        { new: true },
      );
      return bannedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Hủy cấm người dùng
  async unbanUser(id: string) {
    try {
      const unbannedUser = await this.usergoogleModel.findOneAndUpdate(
        { uid: id },
        { isBanned: false },
        { new: true },
      );
      return unbannedUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
