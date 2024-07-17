import { Controller, Get, Query } from '@nestjs/common';
import { RevenueService } from './revenue.service';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) { }

  // Lấy doanh thu hàng tháng theo năm
  @Get('monthly')
  async getMonthlyRevenue(@Query('year') year: number) {
    console.log(`Received request for year: ${year}`); // Log năm nhận được
    const revenue = await this.revenueService.getMonthlyRevenue(year);
    console.log(`Returning revenue data: ${JSON.stringify(revenue)}`); // Log dữ liệu trả về
    return revenue;
  }
}
