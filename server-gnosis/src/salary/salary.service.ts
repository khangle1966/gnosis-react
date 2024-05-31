import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Salary, SalaryDocument } from './entities/salary.entity';
import { Usergoogle, UserDocument } from '../usergoogle/entities/usergoogle.entity';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(Salary.name) private salaryModel: Model<SalaryDocument>,
    @InjectModel(Usergoogle.name) private userModel: Model<UserDocument>,
  ) {}

  async calculateSalary(orderId: string, authorId: string, courseId: string,  amount: number, date: Date): Promise<void> {
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
  }

  async findAll(): Promise<Salary[]> {
    return this.salaryModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Salary[]> {
    return this.salaryModel.find({ userId }).exec();
  }

  async findByMonthAndYear(month: number, year: number): Promise<Salary[]> {
    return this.salaryModel.find({ month, year }).exec();
  }
}
