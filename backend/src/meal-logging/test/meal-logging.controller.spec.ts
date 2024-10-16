import { Test, TestingModule } from '@nestjs/testing';
import { MealLoggingController } from '../meal-logging.controller';
import { MealLoggingService } from '../meal-logging.service';
import { CommonService } from 'src/common/common.service';
import { MealLogSummaryService } from 'src/meal-log-summary/meal-log-summary.service';
import { StorageService } from 'src/storage/storage.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StorageType } from 'src/storage/enum/storage.enum';

describe('MealLoggingController', () => {
  let controller: MealLoggingController;
  let mealLoggingService: MealLoggingService;
  let mealLogSummaryService: MealLogSummaryService;
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealLoggingController],
      providers: [
        {
          provide: MealLoggingService,
          useValue: {
            getMeals: jest.fn(),
            updateMealLogging: jest.fn(),
            deleteMealLogging: jest.fn(),
            markMealConsumed: jest.fn(),
          },
        },
        {
          provide: MealLogSummaryService,
          useValue: {
            getRemainingBudget: jest.fn(),
            updateMealLoggingSummary: jest.fn(),
            removeMealLoggingId: jest.fn(),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getLink: jest.fn(),
          },
        },
        {
          provide: CommonService,
          useValue: {
            decodeHeaders: jest.fn().mockReturnValue({ sub: 'user123' }),
          },
        },
      ],
    }).compile();

    controller = module.get<MealLoggingController>(MealLoggingController);
    mealLoggingService = module.get<MealLoggingService>(MealLoggingService);
    mealLogSummaryService = module.get<MealLogSummaryService>(MealLogSummaryService);
    storageService = module.get<StorageService>(StorageService);
  });

  describe('getMealsPerDay', () => {
    it('should return meals with budget and thumbnails', async () => {
      const payload = {
        startDate: '2024-10-15',
        endDate: '2024-10-15',
        timeZone: 'Asia/Kuala_Lumpur',
      };

      const meals = {
        '2024-10-15': {
          meals: {
            Breakfast: [
              {
                recipe: {
                  storage_links: { thumbnail: 'thumbnail1' },
                },
              },
            ],
          },
        },
      };
      const budget = { '2024-10-15': 2000 };
      const storageEntries = [
        {
          storage_id: 'thumbnail1',
          file_path: 'path/to/file',
          type: StorageType.JPEG,
          size: 1024,
          link: 'http://example.com/thumbnail1.jpg',
        },
      ];

      jest.spyOn(mealLoggingService, 'getMeals').mockResolvedValue(meals);
      jest.spyOn(mealLogSummaryService, 'getRemainingBudget').mockResolvedValue(budget);
      jest.spyOn(storageService, 'getLink').mockResolvedValue(storageEntries);

      const result = await controller.getMealsPerDay(
        { authorization: 'Bearer token' },
        payload,
      );

      expect(result).toEqual({
        '2024-10-15': {
          meals: {
            Breakfast: [
              {
                recipe: {
                  storage_links: { thumbnail: 'http://example.com/thumbnail1.jpg' },
                },
              },
            ],
          },
          budget: 2000,
        },
      });
    });

    it('should throw an error when the service fails', async () => {
      jest
        .spyOn(mealLoggingService, 'getMeals')
        .mockRejectedValue(
          new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR),
        );

      try {
        await controller.getMealsPerDay(
          { authorization: 'Bearer token' },
          {
            startDate: '2024-10-15',
            endDate: '2024-10-15',
            timeZone: 'Asia/Kuala_Lumpur',
          },
        );
      } catch (e) {
        expect(e.message).toBe('Internal Error');
      }
    });
  });
});