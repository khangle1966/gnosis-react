import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Salary, SalaryDocument } from './entities/salary.entity';
import { Usergoogle, UserDocument } from '../usergoogle/entities/usergoogle.entity';
import { LoggerService } from '../logger/logger.service'; // Import LoggerService

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary.name) private salaryModel: Model<SalaryDocument>,
    @InjectModel(Usergoogle.name) private userModel: Model<UserDocument>,
    private readonly loggerService: LoggerService, // Inject LoggerService
  ) { }

  // Tính toán và lưu trữ lương cho giảng viên và admin
  async calculateSalary(orderId: string, authorId: string, courseId: string, amount: number, date: Date): Promise<void> {
    const user = await this.userModel.findOne({ uid: authorId });
    if (!user) {
      throw new Error('User not found');
    }

    let salaryPercentage = 0;
    switch (user.instructorLevel) {
      case 'master':
        salaryPercentage = 0.7;
        break;
      case 'medium':
        salaryPercentage = 0.65;
        break;
      case 'new':
      default:
        salaryPercentage = 0.55;
        break;
    }

    const salaryAmount = amount * salaryPercentage;
    const adminAmount = amount - salaryAmount;

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const instructorSalary = new this.salaryModel({
      userId: authorId,
      amount: salaryAmount,
      month,
      year,
      role: 'instructor',
      courseId,
    });

    await instructorSalary.save();

    const adminSalary = new this.salaryModel({
      userId: 'admin', // Giả định userId của admin là 'admin'
      amount: adminAmount,
      month,
      year,
      role: 'admin',
      courseId,
    });

    await adminSalary.save();

    this.loggerService.log(`Calculated salary for order ${orderId}, author ${authorId}, course ${courseId}`);
  }

  // Lấy tất cả các khoản lương
  async findAll(): Promise<Salary[]> {
    this.loggerService.log('Fetching all salaries');
    const result = await this.salaryModel.find().exec();
    this.loggerService.log(`Found all salaries: ${JSON.stringify(result)}`);
    return result;
  }

  // Lấy các khoản lương của người dùng theo userId
  async findByUserId(userId: string): Promise<Salary[]> {
    this.loggerService.log(`Fetching salaries for user ${userId}`);
    const result = await this.salaryModel.find({ userId }).exec();
    this.loggerService.log(`Found salaries for user ${userId}: ${JSON.stringify(result)}`);
    return result;
  }

  // Lấy các khoản lương theo tháng và năm
  async findByMonthAndYear(month: number, year: number): Promise<Salary[]> {
    this.loggerService.log(`Fetching salaries for month ${month} and year ${year}`);
    const result = await this.salaryModel.find({ month, year }).exec();
    this.loggerService.log(`Found salaries for month ${month} and year ${year}: ${JSON.stringify(result)}`);
    return result;
  }

  // Lấy tổng lương của giảng viên theo tháng và năm
  async getTotalInstructorSalary(): Promise<{ month: number, year: number, total: number }[]> {
    this.loggerService.log('Starting getTotalInstructorSalary');
    const result = await this.salaryModel.aggregate([
      { $match: { role: 'instructor' } },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          total: 1
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);
    this.loggerService.log(`getTotalInstructorSalary aggregation pipeline result: ${JSON.stringify(result)}`);
    return result;
  }

  // Lấy tổng lương của admin theo tháng và năm
  async getTotalAdminSalary(): Promise<{ month: number, year: number, total: number }[]> {
    this.loggerService.log('Starting getTotalAdminSalary');
    const result = await this.salaryModel.aggregate([
      { $match: { role: 'admin' } },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          total: 1
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);
    this.loggerService.log(`getTotalAdminSalary aggregation pipeline result: ${JSON.stringify(result)}`);
    return result;
  }

  // Lấy tổng lương của giảng viên theo instructorId
  async getTotalInstructorSalaryById(instructorId: string): Promise<{ month: number, year: number, total: number }[]> {
    this.loggerService.log(`Starting getTotalInstructorSalaryById for instructor ${instructorId}`);
    const result = await this.salaryModel.aggregate([
      { $match: { userId: instructorId, role: 'instructor' } },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          total: 1
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);
    this.loggerService.log(`getTotalInstructorSalaryById aggregation pipeline result: ${JSON.stringify(result)}`);
    return result;
  }
}

export default SalaryService;
