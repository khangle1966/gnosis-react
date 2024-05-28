import { Controller, Get, Query, Res } from '@nestjs/common';
import { VNPayService } from './vnpay.service';
import { ProfileService } from '../profile/profile.service';
import { LoggerService } from '../logger/logger.service';
import { CourseService } from '../course/course.service';
import { Order } from './order.entity';

@Controller('vnpay')
export class VNPayController {
  constructor(
    private readonly vnpayService: VNPayService,
    private readonly profileService: ProfileService,
    private readonly courseService: CourseService,
    private readonly loggerService: LoggerService,
  ) { }

  @Get('create-payment-url')
  async createPaymentUrl(
    @Query('amount') amount: number,
    @Query('bankCode') bankCode: string,
    @Query('courseIds') courseIds: string,
    @Query('userId') userId: string,
    @Res() res: any,
  ) {
    const courseIdsArray = courseIds.split(',');
    const paymentUrl = await this.vnpayService.createPaymentUrl(amount, bankCode, courseIdsArray, userId);
    res.json({ paymentUrl });
  }

  @Get('callback')
  async paymentCallback(
    @Query() query: any,
    @Res() res: any,
  ) {
    this.loggerService.log(`VNPay callback query: ${JSON.stringify(query)}`);

    const isSuccess = this.vnpayService.verifyPayment(query);
    this.loggerService.log(`Payment verification: ${isSuccess}`);

    if (isSuccess) {
      const orderId = query.vnp_TxnRef;
      const orderDetails = await this.vnpayService.getOrderDetails(orderId);

      this.loggerService.log(`Order details: ${JSON.stringify(orderDetails)}`);

      if (orderDetails) {
        const userId = orderDetails.userId;
        const courseIds = orderDetails.courseIds;

        await this.profileService.addCoursesToUserProfile(userId, courseIds);
        await this.courseService.increaseNumberOfStudents(courseIds);

        const amount = query.vnp_Amount / 100; // Assuming amount is in smallest currency unit (e.g., cents)
        await this.vnpayService.recordRevenue(orderId, amount); // Ghi nhận doanh thu

        res.redirect('http://localhost:4000/home');
      } else {
        this.loggerService.log('Order details not found.');
        res.redirect('http://localhost:3000/payment-fail');
      }
    } else {
      this.loggerService.log('Payment verification failed.');
      res.redirect('http://localhost:3000/payment-fail');
    }
  }

  @Get('order')
  async getAllOrders(): Promise<Order[]> {
    return this.vnpayService.getAllOrders();
  }
}
