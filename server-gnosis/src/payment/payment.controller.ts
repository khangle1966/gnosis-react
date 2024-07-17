import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // Tạo thanh toán mới
  @Post()
  async createPayment(@Body() paymentData: Partial<Payment>): Promise<Payment> {
    return this.paymentService.createPayment(paymentData);
  }

  // Lấy các khoản thanh toán của người dùng theo năm
  @Get(':userId/:year')
  async getPaymentsByUser(@Param('userId') userId: string, @Param('year') year: number): Promise<Payment[]> {
    return this.paymentService.getPaymentsByUser(userId, year);
  }

  // Đánh dấu thanh toán là đã thanh toán
  @Post('pay')
  async markPaymentAsPaid(@Body() paymentData: { userId: string, month: number, year: number }): Promise<Payment> {
    return this.paymentService.markPaymentAsPaid(paymentData.userId, paymentData.month, paymentData.year);
  }
}
