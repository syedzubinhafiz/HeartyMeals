import { Test, TestingModule } from '@nestjs/testing';
import { DietaryController } from './dietary.controller';

describe('DietaryController', () => {
  let controller: DietaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DietaryController],
    }).compile();

    controller = module.get<DietaryController>(DietaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
