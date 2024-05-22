import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VNPayController } from './vnpay.controller';
import { VNPayService } from './vnpay.service';
import { ProfileModule } from '../profile/profile.module';
import { Order, OrderSchema } from './order.entity';
import { LoggerModule } from '../logger/logger.module'; // Import LoggerModule
import { CourseModule } from '../course/course.module';
@Module({
  imports: [
    ProfileModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    LoggerModule, // Thêm LoggerModule vào imports
    CourseModule,
  ],
  controllers: [VNPayController],
  providers: [VNPayService],
})
export class VnpayModule { }
