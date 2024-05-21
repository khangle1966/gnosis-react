import * as crypto from 'crypto';

export class VNPayService {
  private vnp_TmnCode = 'N98MH7WV';
  private vnp_HashSecret = 'YJ2N5AO6NZCP8L8ZYYQXZ839DBNU1FXY';
  private vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private vnp_ReturnUrl = 'http://localhost:8888/order/vnpay_return';

  createPaymentUrl(orderInfo: string, amount: number, orderId: string, clientIp: string): string {

    
    const vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = this.vnp_TmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other'; // Thêm trường vnp_OrderType
    vnp_Params['vnp_Amount'] = amount * 100; // Số tiền phải là chuỗi và nhân 100
    vnp_Params['vnp_ReturnUrl'] = this.vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = clientIp; // Use the dynamically provided IP address
    vnp_Params['vnp_CreateDate'] = this.getCurrentDate();



    const sortedParams = this.sortObject(vnp_Params);
    const signData = this.createQueryString(sortedParams);
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams['vnp_SecureHash'] = signed;
    return this.vnp_Url + '?' + this.createQueryString(sortedParams);
  }

  private sortObject(obj: any): any {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  private createQueryString(params: any): string {
    let query = '';
    for (const key in params) {
      if (query.length > 0) {
        query += '&';
      }
      query += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }
    return query;
  }

  private getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private getExpireDate(): string {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 15); // Set expire time 15 minutes from now
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);
    return `${year}${month}${day}${hour}${minute}${second}`;
  }
}
