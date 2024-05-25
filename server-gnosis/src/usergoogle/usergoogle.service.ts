import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUsergoogleDto } from './dto/create-usergoogle.dto';
import { UpdateUsergoogleDto } from './dto/update-usergoogle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usergoogle, UserDocument } from './entities/usergoogle.entity';
import { Course, CourseDocument } from '../course/entities/course.entity';

@Injectable()
export class UsergoogleService {
  constructor(
    @InjectModel(Usergoogle.name) private readonly usergoogleModel: Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) { }

  async create(createUserDto: CreateUsergoogleDto): Promise<Usergoogle> {
    try {
      const newUser = new this.usergoogleModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

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


  async findByUid(uid: string): Promise<Usergoogle> {
    try {
      const userData = await this.usergoogleModel.findOne({ uid }).exec();
      return userData;
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

  async calculateSalary(uid: string): Promise<number> {
    const user = await this.usergoogleModel.findOne({ uid }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const courses = await this.courseModel.find({ authorId: uid }).exec();
    let totalEarnings = 0;

    courses.forEach(course => {
      totalEarnings += course.numberOfStudents * course.price;
    });

    let salaryPercentage = 0.55; // Default for 'new'
    if (user.instructorLevel === 'medium') {
      salaryPercentage = 0.65;
    } else if (user.instructorLevel === 'master') {
      salaryPercentage = 0.7;
    }

    // Tính lương dựa trên phần trăm thu nhập
    return totalEarnings * salaryPercentage;
  }
}
