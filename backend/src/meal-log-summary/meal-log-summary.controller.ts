import { Body, Controller, Get, Headers, HttpException, Post } from "@nestjs/common";
import { CalculateMealLoggingSummaryDTO } from "./dto/calculate-meal-logging-summary-dto";
import { MealLogSummaryService } from "./meal-log-summary.service";
import { CommonService } from "src/common/common.service";
import { AddMealLoggingSummaryDTO } from "./dto/add-meal-logging-summary-dto";
import { RemoveMealLoggingIdDTO } from "./dto/remove-meal-logging-id-dto";
import { EntityManager } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";
import { AddMealLoggingDTO } from "src/meal-logging/dto/add-meal-logging-dto";
import { MealLoggingService } from "src/meal-logging/meal-logging.service";

@Controller('meal-log-summary')
export class MealLogSummaryController {
    constructor(
        private mealLogSummaryService: MealLogSummaryService,
        private commonService: CommonService,
        @InjectEntityManager() 
        private readonly entityManager: EntityManager,
        private mealLoggingService: MealLoggingService

    ) {}

    @Post('add')
    async addMealLoggingSummary(@Headers() headers: any, @Body() addMealLoggingSummaryDTO: AddMealLoggingSummaryDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                // use transactionalEntityManager to perform operations with transactions
                // create meal logging entries first 

                const addMealLoggingDTO = new AddMealLoggingDTO();
                addMealLoggingDTO.mealDate = addMealLoggingSummaryDTO.mealDate;
                addMealLoggingDTO.mealType = addMealLoggingSummaryDTO.mealType;
                addMealLoggingDTO.recipeIds = addMealLoggingSummaryDTO.recipeIdPortions;

                const meal_logging_ids = await this.mealLoggingService.addMealLogging(decoded_headers, addMealLoggingDTO, transactionalEntityManager);
                // then add meal logging summary
                addMealLoggingSummaryDTO.mealLoggingIds = meal_logging_ids;
                
                await this.mealLogSummaryService.addMealLoggingSummary(decoded_headers, addMealLoggingSummaryDTO, transactionalEntityManager);
            });
            return new HttpException("All meals have been logged.", 200);
        } catch (e) {
            return new HttpException(e.message, 400);
        }

    }

    @Post('calculate')
    async calculate(@Headers() headers: any, @Body() createMealLoggingSummaryDTO: CalculateMealLoggingSummaryDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            return await this.mealLogSummaryService.calculateNutritionSummary(decoded_headers, createMealLoggingSummaryDTO);
        } catch (e) {
            return new HttpException(e.message, 400);
        }

    }

    @Post('remove')
    async removeMealLoggingId(@Headers() headers: any, @Body() payload: RemoveMealLoggingIdDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            await this.mealLogSummaryService.removeMealLoggingId(decoded_headers, payload, this.entityManager);

            return new HttpException("Meal logging removed successfully", 200);
        } catch (e){
            return new HttpException(e.message, 400)
        }
    }
}