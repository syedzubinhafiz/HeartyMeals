import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MealLogSummary } from 'src/meal-log-summary/meal-log-summary.entity';
import { MealLogging } from 'src/meal-logging/meal-logging.entity';
import { User } from 'src/user/user.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  // Mock Repositories
  const mockMealLogSummaryRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    }),
  };

  const mockMealLoggingRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    }),
  };

  const mockUserRepository = {
    findOneByOrFail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(MealLogSummary),
          useValue: mockMealLogSummaryRepository,
        },
        {
          provide: getRepositoryToken(MealLogging),
          useValue: mockMealLoggingRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add additional tests for each method of the AnalyticsService
});

