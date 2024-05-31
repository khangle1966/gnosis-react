import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as qs from 'qs';
import * as config from 'config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.entity';
import { LoggerService } from '../logger/logger.service';
import { Revenue, RevenueDocument } from '../revenue/entities/revenue.entity';
import { Course } from '../course/entities/course.entity';
import { SalaryService } from '../salary/salary.service';

@Injectable()
export class VNPayService {
  private readonly vnp_TmnCode: string = config.get('vnp_TmnCode');
  private readonly vnp_HashSecret: string = config.get('vnp_HashSecret');
  private readonly vnp_Url: string = config.get('vnp_Url');
  private readonly vnp_ReturnUrl: string = config.get('vnp_ReturnUrl');
  private readonly vnp_Api: string = config.get('vnp_Api');

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Revenue.name) private revenueModel: Model<RevenueDocument>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private readonly loggerService: LoggerService,
    private readonly salaryService: SalaryService,
  ) { }

  async createPaymentUrl(amount: number, bankCode: string, courseIds: string[], userId: string): Promise<string> {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr = '127.0.0.1';
    const orderId = moment(date).format('DDHHmmss');
    const locale = 'vn';
    const currCode = 'VND';
    let vnp_Params: any = {};

    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = this.vnp_TmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = courseIds.join(',');
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = this.vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    const courseDetails = await this.getCourseDetails(courseIds, amount);
    await this.createOrder(orderId, userId, courseIds, amount, courseDetails);

    vnp_Params = this.sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = this.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });

    this.loggerService.log(`Payment URL: ${paymentUrl}`);

    return paymentUrl;
  }

  verifyPayment(query: any): boolean {
    this.loggerService.log(`Verifying payment with query: ${JSON.stringify(query)}`); // Log dữ liệu để xác minh thanh toán

    const secureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;

    const sortedParams = this.sortObject(query);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    this.loggerService.log(`Computed hash: ${signed}`); // Log hash đã được tính toán
    this.loggerService.log(`Received hash: ${secureHash}`); // Log hash nhận được

    return secureHash === signed;
  }

  async getAuthorIdsFromCourseIds(courseIds: string[]): Promise<string[]> {
    const courses = await this.courseModel.find({ _id: { $in: courseIds } });
    const authorIds = courses.map(course => course.authorId);
    return [...new Set(authorIds)]; // Loại bỏ các authorId trùng lặp
  }
  async createOrder(
    orderId: string,
    userId: string,
    courseIds: string[],
    amount: number,
    courseDetails: { courseId: string; authorId: string; courseName: string; amount: number }[]
  ): Promise<void> {
    const newOrder = new this.orderModel({ orderId, userId, courseIds, amount, courseDetails });
    await newOrder.save();
    this.loggerService.log(`Created order: ${JSON.stringify(newOrder)}`);
  }

  async getOrderDetails(orderId: string): Promise<Order> {
    const orderDetails = await this.orderModel.findOne({ orderId }).exec();
    this.loggerService.log(`Fetched order details: ${JSON.stringify(orderDetails)}`);
    return orderDetails;
  }

  async getCourseDetails(courseIds: string[], totalAmount: number): Promise<{ courseId: string; authorId: string; courseName: string; amount: number }[]> {
    const courses = await this.courseModel.find({ _id: { $in: courseIds } });
    const totalCoursePrices = courses.reduce((sum, course) => sum + course.price, 0);

    return courses.map(course => ({
      courseId: course._id.toString(),
      authorId: course.authorId,
      courseName: course.name, // Đảm bảo thêm trường courseName ở đây
      amount: (course.price / totalCoursePrices) * totalAmount,
    }));
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.orderModel.find().exec();
    this.loggerService.log(`Fetched all orders: ${JSON.stringify(orders)}`);
    return orders;
  }

  async recordRevenue(orderId: string, amount: number): Promise<void> {
    const orderDetails = await this.getOrderDetails(orderId);
    if (!orderDetails) return;

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    for (const detail of orderDetails.courseDetails) {
      const revenue = new this.revenueModel({
        orderId,
        amount: detail.amount,
        month,
        year,
        authorId: detail.authorId,
        courseId: detail.courseId,
      });

      await revenue.save();
      this.loggerService.log(`Recorded revenue for order ${orderId} and course ${detail.courseId}: ${JSON.stringify(revenue)}`);

      await this.salaryService.calculateSalary(orderId, detail.authorId, detail.courseId,  detail.amount, date);
    }
  }

  private sortObject(obj: any): any {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    });
    return sorted;
  }
}