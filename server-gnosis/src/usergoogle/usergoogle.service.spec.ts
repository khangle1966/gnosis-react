import { Test, TestingModule } from '@nestjs/testing';
import { UsergoogleService } from './usergoogle.service';

describe('UsergoogleService', () => {
  let service: UsergoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsergoogleService],
    }).compile();

    service = module.get<UsergoogleService>(UsergoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
