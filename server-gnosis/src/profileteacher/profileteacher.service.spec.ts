import { Test, TestingModule } from '@nestjs/testing';
import { ProfileteacherService } from './profileteacher.service';

describe('ProfileteacherService', () => {
  let service: ProfileteacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileteacherService],
    }).compile();

    service = module.get<ProfileteacherService>(ProfileteacherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
