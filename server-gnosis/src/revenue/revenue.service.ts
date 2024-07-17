import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Revenue, RevenueDocument } from './entities/revenue.entity';

@Injectable()
export class RevenueService {
  constructor(@InjectModel(Revenue.name) private revenueModel: Model<RevenueDocument>) { }

  // Lấy doanh thu hàng tháng theo năm
  async getMonthlyRevenue(year: number): Promise<any> {
    console.log(`Fetching revenue for year: ${year}`); // Log năm

    // Thêm truy vấn đơn giản để kiểm tra tất cả dữ liệu
    const allRevenues = await this.revenueModel.find({});
    console.log(`All Revenues: ${JSON.stringify(allRevenues)}`); // Log tất cả dữ liệu doanh thu

    const revenues = await this.revenueModel.aggregate([
      {
        $match: {
          year: parseInt(year as unknown as string) // Đảm bảo year là số nguyên
        }
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log(`Fetched revenues: ${JSON.stringify(revenues)}`); // Log kết quả

    return revenues;
  }
}
