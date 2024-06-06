import { Controller, Post, Body } from '@nestjs/common';
import { ZaloPayService } from './zalopay.service';

@Controller('zalopay')
export class ZaloPayController {
  constructor(private readonly zaloPayService: ZaloPayService) {}

  @Post('payment')
  async createPayment(@Body() createPaymentDto: any) {
    return this.zaloPayService.createPayment(createPaymentDto);
  }
}
