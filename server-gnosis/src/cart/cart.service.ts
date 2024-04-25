import { HttpException, Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    try {
      const newCart= new this.cartModel(createCartDto);
      return await newCart.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Cart[]> {
    try {
      return await this.cartModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findById(id).exec();
      if (!cart) {
        throw new NotFoundException(`Cart with id ${id} not found.`);
      }
      return cart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    try {
      // Sử dụng findOneAndUpdate với tùy chọn upsert để cập nhật hoặc tạo mới
     const updateCart = await this.cartModel.findOneAndUpdate({_id: id},{...updateCartDto}, {new: true});
     if (!updateCart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return updateCart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findById(id);
      if (!cart) {
        throw new NotFoundException(`Cart with id ${id} not found.`);
      }
      await this.cartModel.deleteOne({ _id: id });
      return cart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addItemToCart(cartId: string, createCartDto: CreateCartDto): Promise<Cart> {
    try {
      // Sử dụng findOneAndUpdate để thêm item vào cart hoặc cập nhật nếu cartId đã tồn tại
      const addItemToCart = await this.cartModel.findOneAndUpdate({_id: cartId}, this.addItemToCart, {new: true});
      return addItemToCart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeItemFromCart(cartId: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    try {
      // Đảm bảo rằng cart tồn tại
      const cart = await this.findOne(cartId);
      if (!cart) {
        throw new NotFoundException(`Cart with id ${cartId} not found.`);
      }
      if (updateCartDto.delete || cart.quantity <= updateCartDto.quantity) {
        await this.cartModel.deleteOne({_id: cartId});
        return cart;
      } else {
        // Giảm số lượng sản phẩm
        cart.quantity -= updateCartDto.quantity;
        await cart.save(); // Sử dụng save() ở đây vì cần giảm số lượng từ giá trị hiện tại
        return cart;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
