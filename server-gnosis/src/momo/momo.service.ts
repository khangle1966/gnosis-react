// momo.service.ts
import { Injectable} from '@nestjs/common';
import {  HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class MomoService {
  private endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

  constructor(private httpService: HttpService) {}

  async execPostRequest(url: string, data: any): Promise<any> {
    try {
      const response = await this.httpService.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(data)).toString()
        },
        timeout: 5000
      }).toPromise();
      return response.data;
    } catch (error) {
      console.error('Failed to send POST request:', error);
      throw new Error('Failed to send POST request');
    }
  }

  async createPayment(paymentData: any): Promise<string> {
    const { partnerCode, accessKey, secretKey, orderId, orderInfo, amount, ipnUrl, redirectUrl, extraData } = paymentData;
    const requestId = Date.now().toString();
    const requestType = "payWithATM";
    const rawHash = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = this.hashHmac(rawHash, secretKey);

    const data = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: 'http://localhost:4000/cart',
      ipnUrl: 'http://localhost:4000/cart',
      lang: 'vi',
      extraData,
      requestType,
      signature
    };

    const result = await this.execPostRequest(this.endpoint, data);
    return result.payUrl;
  }

  private hashHmac(data: string, key: string): string {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', key).update(data).digest('hex');
  }
}
