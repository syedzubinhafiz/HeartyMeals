import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
import { CalculateMealLoggingSummaryDTO } from "./dto/calculate-meal-logging-summary-dto";
import { MealLogSummaryService } from "./meal-log-summary.service";
import { CommonService } from "src/common/common.service";
import { AddMealLoggingSummaryDTO } from "./dto/add-meal-logging-summary-dto";
import { EntityManager } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";
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

                const meal_logging_ids = await this.mealLoggingService.addMealLogging(decoded_headers, addMealLoggingSummaryDTO, transactionalEntityManager);
                
                await this.mealLogSummaryService.addMealLoggingSummary(decoded_headers, addMealLoggingSummaryDTO, meal_logging_ids, transactionalEntityManager);
            });
            return new HttpException("All meals have been logged.", HttpStatus.OK);
        } catch (e) {
            return new HttpException(e.message, e.status);
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

    @Get('budget')
    async getRemainingBudget(@Headers() headers, @Query("startDate") date: string, @Query("timeZone") timeZone: string){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            return this.mealLogSummaryService.getRemainingBudget(decoded_headers, date, null, timeZone, null);
        } catch (e){
            return new HttpException(e.message, 400)
        }
    }

}