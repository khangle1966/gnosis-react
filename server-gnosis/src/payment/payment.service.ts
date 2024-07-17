import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>) { }

  // Tạo thanh toán mới
  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    this.logger.log(`Creating payment for user ${paymentData.userId}`);
    const createdPayment = new this.paymentModel(paymentData);
    return createdPayment.save();
  }

  // Lấy các khoản thanh toán của người dùng theo năm
  async getPaymentsByUser(userId: string, year: number): Promise<Payment[]> {
    return this.paymentModel.find({ userId, year }).exec();
  }

  // Đánh dấu thanh toán là đã thanh toán
  async markPaymentAsPaid(userId: string, month: number, year: number): Promise<Payment> {
    this.logger.log(`Marking payment as paid for user ${userId}, month ${month}, year ${year}`);
    return this.paymentModel.findOneAndUpdate(
      { userId, month, year },
      { isPayment: true },
      { new: true }
    ).exec();
  }
}
