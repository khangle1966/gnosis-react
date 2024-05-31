import { Controller, Get, Query, Param } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { Salary } from './entities/salary.entity';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get()
  async getAllSalaries(): Promise<Salary[]> {
    return this.salaryService.findAll();
  }

  @Get(':userId')
  async getSalariesByUserId(@Param('userId') userId: string): Promise<Salary[]> {
    return this.salaryService.findByUserId(userId);
  }

  @Get('monthly/:month/:year')
  async getMonthlySalaries(
    @Param('month') month: number,
    @Param('year') year: number,
  ): Promise<Salary[]> {
    return this.salaryService.findByMonthAndYear(month, year);
  }
}
