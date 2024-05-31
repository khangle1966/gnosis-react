import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VNPayController } from './vnpay.controller';
import { VNPayService } from './vnpay.service';
import { ProfileModule } from '../profile/profile.module';
import { Order, OrderSchema } from './order.entity';
import { LoggerModule } from '../logger/logger.module';
import { CourseModule } from '../course/course.module';
import { Revenue, RevenueSchema } from '../revenue/entities/revenue.entity';
import { Course, CourseSchema } from '../course/entities/course.entity';
import { SalaryModule } from '../salary/salary.module';

@Module({
  imports: [
    ProfileModule,
    LoggerModule,
    CourseModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Revenue.name, schema: RevenueSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
    SalaryModule,
  ],
  controllers: [VNPayController],
  providers: [VNPayService],
})
export class VnpayModule { }
