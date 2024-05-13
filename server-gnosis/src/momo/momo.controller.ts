// momo.controller.ts
import { Body, Controller, Post, Redirect, HttpCode, HttpStatus } from '@nestjs/common';
import { MomoService } from './momo.service';

@Controller('momo')
export class MomoController {
  constructor(private readonly momoService: MomoService) {}

  @Post('pay')
  @HttpCode(HttpStatus.OK)
  async initiatePayment(@Body() paymentData: any) {
    const payUrl = await this.momoService.createPayment(paymentData);
    return { url: payUrl };
  }
}
