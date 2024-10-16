import { Test, TestingModule } from '@nestjs/testing';
import { MealLoggingService } from './meal-logging.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MealLogging } from './meal-logging.entity';
import { User } from 'src/user/user.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { AddMealLoggingSummaryDTO } from 'src/meal-log-summary/dto/add-meal-logging-summary-dto';
import { MealType } from '../meal-type.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MealLoggingService', () => {
  let service: MealLoggingService;
  let mealLoggingRepo: Repository<MealLogging>;
  let userRepo: Repository<User>;
  let recipeRepo: Repository<Recipe>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealLoggingService,
        {
          provide: getRepositoryToken(MealLogging),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Recipe),
          useClass: Repository,
        },
        {
          provide: CommonService,
          useValue: {
            isWithinDateRange: jest.fn().mockReturnValue(true),
            listDatesWithTimezone: jest.fn().mockReturnValue(['2024-10-15']),
          },
        },
      ],
    }).compile();

    service = module.get<MealLoggingService>(MealLoggingService);
    mealLoggingRepo = module.get<Repository<MealLogging>>(getRepositoryToken(MealLogging));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    recipeRepo = module.get<Repository<Recipe>>(getRepositoryToken(Recipe));
  });

  describe('addMealLogging', () => {
    it('should add meal logging successfully', async () => {
      const mockUser = { user_id: 'user123' } as User;
      const mockRecipes = [{ id: 'recipe1' }] as Recipe[];

      jest.spyOn(userRepo, 'findOneByOrFail').mockResolvedValue(mockUser);
      jest.spyOn(recipeRepo, 'findBy').mockResolvedValue(mockRecipes);

      const dto: AddMealLoggingSummaryDTO = {
        mealDate: '2024-10-15',
        userLocalDateTime: '2024-10-15T10:00:00',
        timeZone: 'Asia/Kuala_Lumpur',
        recipeIdPortions: [{ recipeId: 'recipe1', portion: 1 }],
        mealType: MealType.BREAKFAST,
        isMealPlanning: false,
      };

      const result = await service.addMealLogging({ sub: 'user123' }, dto, {} as any);
      expect(result).toBeInstanceOf(Array); // Assuming it returns an array of IDs.
    });

    it('should throw an error if recipes are not found', async () => {
      jest.spyOn(userRepo, 'findOneByOrFail').mockResolvedValue({ user_id: 'user123' });
      jest.spyOn(recipeRepo, 'findBy').mockResolvedValue([]);

      const dto: AddMealLoggingSummaryDTO = {
        mealDate: '2024-10-15',
        userLocalDateTime: '2024-10-15T10:00:00',
        timeZone: 'Asia/Kuala_Lumpur',
        recipeIdPortions: [{ recipeId: 'recipe1', portion: 1 }],
        mealType: MealType.BREAKFAST,
        isMealPlanning: false,
      };

      try {
        await service.addMealLogging({ sub: 'user123' }, dto, {} as any);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Recipe with id recipe1 not found');
      }
    });
  });
});