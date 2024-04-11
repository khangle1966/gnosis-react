import { Test, TestingModule } from '@nestjs/testing';
import { ProfileteacherController } from './profileteacher.controller';
import { ProfileteacherService } from './profileteacher.service';

describe('ProfileteacherController', () => {
  let controller: ProfileteacherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileteacherController],
      providers: [ProfileteacherService],
    }).compile();

    controller = module.get<ProfileteacherController>(ProfileteacherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
