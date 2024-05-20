import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { VnpayService } from './vnpay.service';

@Controller('vnpay')
export class VnpayController {
    constructor(private readonly vnpayService: VnpayService) { }

    @Post('create_payment_url')
    createPaymentUrl(@Body() body, @Req() req: Request, @Res() res: Response) {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let ipAddr: string | string[] = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Nếu ipAddr là một mảng, lấy phần tử đầu tiên
        if (Array.isArray(ipAddr)) {
            ipAddr = ipAddr[0];
        }

        // Chuyển đổi địa chỉ IPv6 loopback (::1) thành IPv4 loopback (127.0.0.1)
        ipAddr = ipAddr === '::1' ? '192.168.1.3' : ipAddr;

        const paymentUrl = this.vnpayService.createPaymentUrl(body, ipAddr);
        console.log('Generated payment URL:', paymentUrl); // Log URL thanh toán được tạo

        res.json({ paymentUrl });
    }
}
