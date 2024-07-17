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
  ) { }

  // Tạo một giỏ hàng mới
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    try {
      const newCart = new this.cartModel(createCartDto);
      return await newCart.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy tất cả các giỏ hàng
  async findAll(): Promise<Cart[]> {
    try {
      return await this.cartModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy giỏ hàng theo ID
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

  // Cập nhật giỏ hàng theo ID
  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    try {
      const updateCart = await this.cartModel.findOneAndUpdate({ _id: id }, { ...updateCartDto }, { new: true });
      if (!updateCart) {
        throw new NotFoundException(`Cart with ID ${id} not found`);
      }
      return updateCart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Xóa giỏ hàng theo ID
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

  // Thêm item vào giỏ hàng theo cartId
  async addItemToCart(cartId: string, createCartDto: CreateCartDto): Promise<Cart> {
    try {
      const addItemToCart = await this.cartModel.findOneAndUpdate({ _id: cartId }, this.addItemToCart, { new: true });
      return addItemToCart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Xóa item khỏi giỏ hàng theo cartId
  async removeItemFromCart(cartId: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    try {
      const cart = await this.findOne(cartId);
      if (!cart) {
        throw new NotFoundException(`Cart with id ${cartId} not found.`);
      }
      if (updateCartDto.delete || cart.quantity <= updateCartDto.quantity) {
        await this.cartModel.deleteOne({ _id: cartId });
        return cart;
      } else {
        cart.quantity -= updateCartDto.quantity;
        await cart.save();
        return cart;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
