import { Controller, Get, Query } from '@nestjs/common';
import { RevenueService } from './revenue.service';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) { }

  @Get('monthly')
  async getMonthlyRevenue(@Query('year') year: number) {
    console.log(`Received request for year: ${year}`); // Log the received year
    const revenue = await this.revenueService.getMonthlyRevenue(year);
    console.log(`Returning revenue data: ${JSON.stringify(revenue)}`); // Log the returned data
    return revenue;
  }
}
