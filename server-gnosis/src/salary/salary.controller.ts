import { Controller, Get, Param } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { Salary } from './entities/salary.entity';
import { LoggerService } from '../logger/logger.service'; // Import LoggerService

@Controller('salary')
export class SalaryController {
  constructor(
    private readonly salaryService: SalaryService,
    private readonly loggerService: LoggerService, // Inject LoggerService
  ) { }

  @Get()
  async getAllSalaries(): Promise<Salary[]> {
    this.loggerService.log('Fetching all salaries');
    return this.salaryService.findAll();
  }

  @Get(':userId')
  async getSalariesByUserId(@Param('userId') userId: string): Promise<Salary[]> {
    this.loggerService.log(`Fetching salaries for user ${userId}`);
    return this.salaryService.findByUserId(userId);
  }

  @Get('monthly/:month/:year')
  async getMonthlySalaries(
    @Param('month') month: number,
    @Param('year') year: number,
  ): Promise<Salary[]> {
    this.loggerService.log(`Fetching salaries for month ${month} and year ${year}`);
    return this.salaryService.findByMonthAndYear(month, year);
  }

  @Get('total-admin-salary/admin')
  async getTotalAdminSalary(): Promise<{ month: number, year: number, total: number }[]> {
    const result = await this.salaryService.getTotalAdminSalary();
    this.loggerService.log(`Total Admin Salary: ${JSON.stringify(result)}`);
    return result;
  }

  @Get('total-instructor-salary/instructors')
  async getTotalInstructorSalary(): Promise<{ month: number, year: number, total: number }[]> {
    const result = await this.salaryService.getTotalInstructorSalary();
    this.loggerService.log(`Total Instructor Salary: ${JSON.stringify(result)}`);
    return result;
  }

  @Get('instructor-salary/:instructorId')
  async getTotalInstructorSalaryById(@Param('instructorId') instructorId: string): Promise<{ month: number, year: number, total: number }[]> {
    this.loggerService.log(`Fetching total salary for instructor ${instructorId}`);
    return this.salaryService.getTotalInstructorSalaryById(instructorId);
  }


}

export default SalaryController;
