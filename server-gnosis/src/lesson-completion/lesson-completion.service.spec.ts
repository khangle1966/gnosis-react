import { Test, TestingModule } from '@nestjs/testing';
import { LessonCompletionService } from './lesson-completion.service';

describe('LessonCompletionService', () => {
  let service: LessonCompletionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonCompletionService],
    }).compile();

    service = module.get<LessonCompletionService>(LessonCompletionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
