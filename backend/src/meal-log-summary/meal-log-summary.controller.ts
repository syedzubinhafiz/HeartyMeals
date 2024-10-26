import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
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

    /**
     * Post method to first create the meal logging entries, then add the entries to the meal logging summary
     * @param headers - headers that contains the authorization token
     * @param addMealLoggingSummaryDTO - payload that contains the recipe information
     * @returns 
     */
    @Post('add')
    async addMealLoggingSummary(@Headers() headers: any, @Body() addMealLoggingSummaryDTO: AddMealLoggingSummaryDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                // use transactionalEntityManager to perform operations with transactions

                // create meal logging entries
                const meal_logging_ids = await this.mealLoggingService.addMealLogging(decoded_headers, addMealLoggingSummaryDTO, transactionalEntityManager);
                
                // add to meal logging summary 
                await this.mealLogSummaryService.addMealLoggingSummary(decoded_headers, addMealLoggingSummaryDTO, meal_logging_ids, transactionalEntityManager);
            });
            return new HttpException("All meals have been logged.", HttpStatus.OK);
        } catch (e) {
            return new HttpException(e.message, e.status);
        }

    }

    /**
     * Get method to get the remaining budget of the user for the day
     * @param headers - headers that contains the authorization token
     * @param date - query that contains the date requested to get the remaining budget from
     * @param timeZone - query that contains the time zone of the user
     * @returns a list containing the daily budget, remaining nutrients, and a flag indicating if the user has exceeded the budget
     */
    @Get('budget')
    async getRemainingBudget(@Headers() headers, @Query("startDate") date: string, @Query("timeZone") timeZone: string){
        try {
            const decoded_headers = this.commonService.decodeHeaders(headers.authorization);

            return this.mealLogSummaryService.getRemainingBudget(decoded_headers, date, null, timeZone, null);
        } catch (e){
            return new HttpException(e.message, 400)
        }
    }

}