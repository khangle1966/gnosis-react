import { Test, TestingModule } from '@nestjs/testing';
import { LessonCompletionController } from './lesson-completion.controller';
import { LessonCompletionService } from './lesson-completion.service';

describe('LessonCompletionController', () => {
  let controller: LessonCompletionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonCompletionController],
      providers: [LessonCompletionService],
    }).compile();

    controller = module.get<LessonCompletionController>(LessonCompletionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
