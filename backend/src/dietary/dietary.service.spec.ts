import { Test, TestingModule } from '@nestjs/testing';
import { DietaryService } from './dietary.service';

describe('DietaryService', () => {
  let service: DietaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietaryService],
    }).compile();

    service = module.get<DietaryService>(DietaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
