import { Test, TestingModule } from '@nestjs/testing';
import { EthnicityController } from './ethnicity.controller';

describe('EthnicityController', () => {
  let controller: EthnicityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EthnicityController],
    }).compile();

    controller = module.get<EthnicityController>(EthnicityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
