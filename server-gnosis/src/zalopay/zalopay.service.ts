import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class ZaloPayService {
  async createPayment(createPaymentDto: any) {
    const { amount, orderId, description } = createPaymentDto;

    const app_id = '554';
    const key1 = '8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn';
    const app_trans_id = `${Date.now()}`; // Unique order ID
    const app_time = Date.now();
    const embed_data = '{}';
    const item = '[]';

    // Định nghĩa biến app_user
    const app_user = 'user123'; // Replace with your actual user identifier

    const data = `${app_id}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`;
    const mac = crypto.createHmac('sha256', key1).update(data).digest('hex');

    const requestBody = {
      app_id,
      app_trans_id,
      app_user,
      app_time,
      amount,
      embed_data,
      item,
      description,
      mac,
    };

    const response = await axios.post('https://sandbox.zalopay.com.vn/v001/tpe/createorder', requestBody);

    return response.data;
  }
}
