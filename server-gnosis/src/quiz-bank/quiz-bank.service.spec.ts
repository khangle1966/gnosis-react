import { Test, TestingModule } from '@nestjs/testing';
import { QuizBankService } from './quiz-bank.service';

describe('QuizBankService', () => {
  let service: QuizBankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizBankService],
    }).compile();

    service = module.get<QuizBankService>(QuizBankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
