import { Controller, Post, Body, Req } from '@nestjs/common';
import { VNPayService } from './vnpay.service';

@Controller('vnpay')
export class VNPayController {
  constructor(private readonly vnpayService: VNPayService) {}

  @Post('create_payment_url')
  createPaymentUrl(@Body() body: any, @Req() req: any) {
    const { amount, orderId, orderInfo } = body;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const paymentUrl = this.vnpayService.createPaymentUrl(orderInfo, amount, orderId, clientIp);
    return { paymentUrl };
  }
}
