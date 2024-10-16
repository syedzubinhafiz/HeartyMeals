import { Test, TestingModule } from '@nestjs/testing';
import { MealLogSummaryController } from '../meal-log-summary.controller';
import { MealLogSummaryService } from '../meal-log-summary.service';
import { AddMealLoggingSummaryDTO } from '../dto/add-meal-logging-summary-dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import {MealType} from '../../meal-type.enum';

describe('MealLogSummaryController', () => {
  let controller: MealLogSummaryController;
  let service: MealLogSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealLogSummaryController],
      providers: [MealLogSummaryService],
    }).compile();

    controller = module.get<MealLogSummaryController>(MealLogSummaryController);
    service = module.get<MealLogSummaryService>(MealLogSummaryService);
  });

  it('should log meal successfully', async () => {
    const dto: AddMealLoggingSummaryDTO = {
      mealDate: '2024-10-03',
      userLocalDateTime: '2024-10-03T15:51:00',
      timeZone: 'Asia/Kuala_Lumpur',
      recipeIdPortions: [{ recipeId: 'c2e4d655-e079-46a9-9393-e2d62118a58f', portion: 0.5 }],
      mealType: MealType.BREAKFAST,
      isMealPlanning: false,
    };

    const headers = { authorization: 'Bearer token' };
    jest.spyOn(service, 'addMealLoggingSummary').mockResolvedValue();

    const result = await controller.addMealLoggingSummary(headers, dto);

    expect(result).toEqual(new HttpException('All meals have been logged.', HttpStatus.OK));
  });
});