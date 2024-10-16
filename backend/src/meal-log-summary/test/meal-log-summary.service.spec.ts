import { Test, TestingModule } from '@nestjs/testing';
import { MealLogSummaryService } from '../meal-log-summary.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MealLogSummary } from '../meal-log-summary.entity';
import { User } from 'src/user/user.entity';
import { CommonService } from 'src/common/common.service';
import { Repository, EntityManager } from 'typeorm';
import { AddMealLoggingSummaryDTO } from '../dto/add-meal-logging-summary-dto';
import {MealType} from '../../meal-type.enum';
import { Gender } from '../../user/enum/gender.enum';
import { UserRole } from '../../user/enum/user-role.enum';
import { CholesterolLevel } from '../../user/enum/cholesterol.enum';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';

describe('MealLogSummaryService', () => {
  let service: MealLogSummaryService;
  let mealLogSummaryRepo: Repository<MealLogSummary>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealLogSummaryService,
        {
          provide: getRepositoryToken(MealLogSummary),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: CommonService,
          useValue: {
            calculateNutritionAfter: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MealLogSummaryService>(MealLogSummaryService);
    mealLogSummaryRepo = module.get<Repository<MealLogSummary>>(getRepositoryToken(MealLogSummary));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('addMealLoggingSummary', () => {
    it('should add meal logging summary successfully', async () => {
      const mockUser: User = {
        user_id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        gender: Gender.MALE,
        age: 30,
        height: 180,
        weight: 75,
        nyha_level: 2, 
        medical_info: { warfarin: false }, 
        user_role: UserRole.PATIENT,
        country: {
          id: 'MYS',
          name: 'Malaysia'
        } as Country,
        dietary: {
          id: 'cd7a45fc-c6c5-4ef1-8576-f259a0ee738c',
          name: 'Halal'
        } as Dietary,
        ethnicity: {
          id: '51980097-745e-4ea2-b7a3-7dbc0ad5f308',
          name: 'Chinese'
        } as Ethnicity, 
        user_nutrition_setting: {
          activity_level: 2, 
          fat_percentage: 0.2,
          carbs_percentage: 0.4,
          cholesterol_level: CholesterolLevel.HIGH, 
          protein_percentage: 0.4
        },
        daily_budget: {
          calories: 2478,
          fat: 55,
          carbs: 247.8,
          protein: 247.8,
          sodium: 2300,
          cholesterol: 200,
          water_intake: 2000 
        },
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      };
  
      const dto: AddMealLoggingSummaryDTO = {
        mealDate: '2024-10-03',
        userLocalDateTime: '2024-10-03T15:51:00',
        timeZone: 'Asia/Kuala_Lumpur',
        recipeIdPortions: [{ recipeId: 'c2e4d655-e079-46a9-9393-e2d62118a58f', portion: 0.5 }],
        mealType: MealType.BREAKFAST,
        isMealPlanning: false,
      };
  
      const mealLoggingIds = ['log1', 'log2'];
      const transactionalEntityManager = {} as EntityManager;
  
      userRepo.findOneBy = jest.fn().mockResolvedValue(mockUser);
      mealLogSummaryRepo.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
  
      const saveSpy = jest.spyOn(transactionalEntityManager, 'save').mockResolvedValue({});
  
      await service.addMealLoggingSummary({}, dto, mealLoggingIds, transactionalEntityManager);
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('addMealLoggingSummary', () => {
    it('should add meal logging summary successfully', async () => {
      const mockUser: User = {
        user_id: '123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        gender: Gender.MALE,
        age: 30,
        height: 180,
        weight: 75,
        nyha_level: 2,
        medical_info: "{\"warfarin\":false}",
        user_role: UserRole.PATIENT,
        country: {
          id: 'MYS',
          name: 'Malaysia'
        } as Country,
        dietary: {
          id: 'cd7a45fc-c6c5-4ef1-8576-f259a0ee738c',
          name: 'Halal'
        } as Dietary,
        ethnicity: {
          id: '51980097-745e-4ea2-b7a3-7dbc0ad5f308',
          name: 'Chinese'
        } as Ethnicity, // Assuming this structure for ethnicity
        user_nutrition_setting: {
          activity_level: 2, // 1 for sedentary, 2 for light, etc.
          fat_percentage: 0.2,
          carbs_percentage: 0.4,
          cholesterol_level: CholesterolLevel.HIGH, // Assuming this enum value
          protein_percentage: 0.4
        },
        daily_budget: {
          calories: 2478,
          fat: 55,
          carbs: 247.8,
          protein: 247.8,
          sodium: 2300,
          cholesterol: 200,
          water_intake: 2000 // Assuming this is part of daily_budget based on your example
        },
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null // Assuming null means the user is not deleted
      };
  
      const dto: AddMealLoggingSummaryDTO = {
        mealDate: '2024-10-03',
        userLocalDateTime: '2024-10-03T15:51:00',
        timeZone: 'Asia/Kuala_Lumpur',
        recipeIdPortions: [{ recipeId: 'c2e4d655-e079-46a9-9393-e2d62118a58f', portion: 0.5 }],
        mealType: MealType.BREAKFAST,
        isMealPlanning: false,
      };
  
      const mealLoggingIds = ['log1', 'log2'];
      const transactionalEntityManager = {} as EntityManager;
  
      userRepo.findOneBy = jest.fn().mockResolvedValue(mockUser);
      mealLogSummaryRepo.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });
  
      const saveSpy = jest.spyOn(transactionalEntityManager, 'save').mockResolvedValue({});
  
      await service.addMealLoggingSummary({}, dto, mealLoggingIds, transactionalEntityManager);
      expect(saveSpy).toHaveBeenCalled();
    });
  });
});