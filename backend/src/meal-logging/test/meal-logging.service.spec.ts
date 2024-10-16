import { Test, TestingModule } from '@nestjs/testing';
import { MealLoggingService } from '../meal-logging.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MealLogging } from '../meal-logging.entity';
import { User } from 'src/user/user.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { AddMealLoggingSummaryDTO } from 'src/meal-log-summary/dto/add-meal-logging-summary-dto';
import {MealType} from '../../meal-type.enum';
import { Gender } from '../../user/enum/gender.enum';
import { UserRole } from '../../user/enum/user-role.enum';
import { CholesterolLevel } from '../../user/enum/cholesterol.enum';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
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
      const mockUser: User = {
        user_id: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        gender: Gender.MALE, // Adjust based on your Gender enum
        age: 30,
        height: 180,
        weight: 75,
        nyha_level: 2,
        medical_info: JSON.parse('{"warfarin": false}'), // Use a valid JSON object
        user_role: UserRole.PATIENT, // Adjust based on your UserRole enum
        country: { id: 'MYS', name: 'Malaysia' } as any, // Mock country entity
        dietary: { id: 'dietary1', name: 'Halal' } as any, // Mock dietary entity
        ethnicity: { id: 'ethnicity1', name: 'Chinese' } as any, // Mock ethnicity entity
        user_nutrition_setting: {
          activity_level: 2,
          fat_percentage: 0.2,
          carbs_percentage: 0.4,
          cholesterol_level: 'HIGH', // Adjust based on CholesterolLevel enum
          protein_percentage: 0.4,
        },
        daily_budget: {
          calories: 2478,
          fat: 55,
          carbs: 247.8,
          protein: 247.8,
          sodium: 2300,
          cholesterol: 200,
          water_intake: 2000,
        },
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };
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
      expect(result).toBeInstanceOf(Array);
    });

    it('should throw an error if recipes are not found', async () => {
      jest.spyOn(userRepo, 'findOneByOrFail').mockResolvedValue({
        user_id: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        gender: Gender.MALE, // Adjust based on your Gender enum
        age: 30,
        height: 180,
        weight: 75,
        nyha_level: 2,
        medical_info: JSON.parse('{"warfarin": false}'), // Use a valid JSON object
        user_role: UserRole.PATIENT, // Adjust based on your UserRole enum
        country: { id: 'MYS', name: 'Malaysia' } as any, // Mock country entity
        dietary: { id: 'dietary1', name: 'Halal' } as any, // Mock dietary entity
        ethnicity: { id: 'ethnicity1', name: 'Chinese' } as any, // Mock ethnicity entity
        user_nutrition_setting: {
          activity_level: 2,
          fat_percentage: 0.2,
          carbs_percentage: 0.4,
          cholesterol_level: 'HIGH', // Adjust based on CholesterolLevel enum
          protein_percentage: 0.4,
        },
        daily_budget: {
          calories: 2478,
          fat: 55,
          carbs: 247.8,
          protein: 247.8,
          sodium: 2300,
          cholesterol: 200,
          water_intake: 2000,
        },
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });
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