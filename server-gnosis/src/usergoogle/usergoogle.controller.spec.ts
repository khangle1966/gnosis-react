import { Test, TestingModule } from '@nestjs/testing';
import { UsergoogleController } from './usergoogle.controller';
import { UsergoogleService } from './usergoogle.service';

describe('UsergoogleController', () => {
  let controller: UsergoogleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsergoogleController],
      providers: [UsergoogleService],
    }).compile();

    controller = module.get<UsergoogleController>(UsergoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
