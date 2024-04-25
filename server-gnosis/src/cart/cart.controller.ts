import { Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  HttpException,
  HttpStatus,
   } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';


@Controller('v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('post/')
  async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    const requiredFields = ['name'];
    const missingFields = requiredFields.filter(
      (field) => !createCartDto[field],
    );
    if (missingFields.length > 0) {
      throw new HttpException(
        `Missing required fields: ${missingFields.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const createCart = await this.cartService.create(createCartDto);
      return createCart;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  @Get('get/')
  async findAll(): Promise<Cart[]> {
    try {
      const cart = await this.cartService.findAll();
      return cart;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string): Promise<Cart> {
    try {
      const cart = await this.cartService.findOne(id);
      return cart;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('put/:id')
  async update(
    @Param('id') id: string, 
    @Body() updateCartDto: UpdateCartDto): Promise<Cart> {
      try {
        const cart = await this.cartService.update(id, updateCartDto);
        return cart;
      } catch (error) {
        throw new HttpException(error.message, error.status);
      }  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<Cart> {
    try {
      const cart = await this.cartService.remove(id);
      return cart;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // @Post(':id/add')
  // async addItemToCart(@Param('id') id: string, @Body() addItemDto: CreateCartDto) {
  //   return await this.cartService.addItemToCart(id, addItemDto);
  // }

  
}
