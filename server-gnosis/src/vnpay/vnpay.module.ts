import { Module } from '@nestjs/common';
import { VNPayController } from './vnpay.controller';
import { VNPayService } from './vnpay.service';

@Module({
  controllers: [VNPayController],
  providers: [VNPayService],
})
export class VnpayModule {}
