import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { MomoService } from './momo.service';

@Controller('momo')
export class MomoController {
  constructor(private readonly momoService: MomoService) {}

  @Post('pay')
  async initiatePayment(@Body() paymentData: { amount: number; orderId: string; orderInfo: string }) {
    try {
      const paymentResponse = await this.momoService.createPayment(paymentData.amount, paymentData.orderId, paymentData.orderInfo);
      return paymentResponse;
    } catch (error) {
      throw new HttpException('Payment initiation failed', HttpStatus.BAD_REQUEST);
    }
  }
}
