import { Test, TestingModule } from '@nestjs/testing';
import { QuizBankController } from './quiz-bank.controller';
import { QuizBankService } from './quiz-bank.service';

describe('QuizBankController', () => {
  let controller: QuizBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizBankController],
      providers: [QuizBankService],
    }).compile();

    controller = module.get<QuizBankController>(QuizBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
