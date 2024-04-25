import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './entities/cart.entity';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])
      ],
      providers: [CartService],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
