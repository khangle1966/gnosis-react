import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as querystring from 'qs'; // Sử dụng `qs` thay vì `querystring`
import * as moment from 'moment';

@Injectable()
export class VnpayService {
    createPaymentUrl(body, ipAddr) {
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        
        const config = {
            tmnCode: 'N98MH7WV', // Thay thế bằng Tmn code của bạn
            secretKey: 'YJ2N5AO6NZCP8L8ZYYQXZ839DBNU1FXY', // Thay thế bằng secret key của bạn
            vnpUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            returnUrl: 'http://localhost:3000/payment-success', // Thay thế bằng URL trả về của bạn
        };

        const orderId = moment(date).format('DDHHmmss');
        const amount = body.amount;
        const bankCode = body.bankCode;
        
        let locale = body.language;
        if (!locale) {
            locale = 'vn';
        }

        const currCode = 'VND';
        const vnpParams: Record<string, any> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: config.tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: config.returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        if (bankCode) {
            vnpParams['vnp_BankCode'] = bankCode;
        }

        const sortedParams = this.sortObject(vnpParams);

        // Sử dụng `querystring` từ `qs` để tạo chuỗi ký
        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac('sha512', config.secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams['vnp_SecureHash'] = signed;

        // Tạo URL thanh toán cuối cùng
        const vnpUrl = config.vnpUrl + '?' + querystring.stringify(sortedParams, { encode: false });

        console.log('vnpParams before signing:', vnpParams); // Log thông tin trước khi ký
        console.log('signData:', signData); // Log dữ liệu trước khi ký
        console.log('vnpParams after signing:', sortedParams); // Log thông tin sau khi ký
        console.log('Generated final URL:', vnpUrl); // Log URL thanh toán được tạo

        return vnpUrl;
    }

    sortObject(obj: Record<string, any>): Record<string, any> {
        const sorted: Record<string, any> = {};
        const keys = Object.keys(obj).sort();
        keys.forEach(key => {
            sorted[key] = obj[key];
        });
        return sorted;
    }
}
