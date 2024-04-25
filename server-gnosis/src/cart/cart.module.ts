import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './entities/cart.entity';

@Module({
  imports: [
    // Đăng ký Mongoose model cho Cart
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [CartController],  // Đăng ký controller
  providers: [CartService],       // Đăng ký service
  exports: [CartService],         // Xuất CartService để có thể tái sử dụng ở các module khác
})
export class CartModule {}
