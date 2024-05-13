import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class MomoService {
  constructor(private httpService: HttpService) {}

  async createPayment(data: any) {
    const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    const partnerCode = 'MOMOBKUN20180529';
    const accessKey = 'klm05TvNBzhg7h7j';
    const secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
    const {
      orderId,
      orderInfo,
      amount,
      ipnUrl,
      redirectUrl,
      extraData = "",
    } = data;

    const requestId = Date.now().toString();
    const requestType = "payWithATM";

    const rawHash = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawHash).digest('hex');

    const payload = {
      partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: 'vi',
      extraData,
      requestType,
      signature,
    };

    return this.httpService.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map(response => response.data)
    ).toPromise();
  }
}
