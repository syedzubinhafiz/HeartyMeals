import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";
import { CommonService } from "src/common/common.service";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { MealLogSummaryService } from "src/meal-log-summary/meal-log-summary.service";
import { DeleteMealLoggingDTO } from "./dto/delete-meal-logging-dto";
import { UpdateMealLoggingDTO } from "./dto/update-meal-logging-dto";
import { GetMealLoggingDTO } from "./dto/get-meal-logging-dto";


@Controller('meal-planning')
export class MealPlanningController {
    constructor(
        private mealLoggingService: MealLoggingService,
        private commonService: CommonService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        private mealLoggingSummaryService: MealLogSummaryService,
    ){}

    /**
     * Get method to get all the meals in a specific date
     * @param headers - headers that contains the authorization token
     * @param query - query that contains the date range requested to get the meals from
     * @returns a list of meals on the date, sorted by meal types
     */
    @Get('get')
    async getMealsPerDay(@Headers() headers: any, @Query() payload: GetMealLoggingDTO){
    try {
            const decoded_headers = this.commonService.decodeHeaders(headers.authorization);

            // get meals
            const meals = await this.mealLoggingService.getMeals(decoded_headers, payload);

            // get budget
            const budget = await this.mealLoggingSummaryService.getRemainingBudget(decoded_headers, payload.startDate, payload.endDate, payload.timeZone, null);

            // for each date, put the budget in the meals
            for (const date in meals){
                if (budget[date]){
                    meals[date].budget = budget[date];
                }
            }

            return meals;
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
    }

    /**
     * Post method to update the meal logging to change to another day
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains the meal logging id and the new date
     * @returns HttpException 200 if the meal is updated 
     */
    @Post('update')
    async updateMealLogging(@Headers() headers: any, @Body() payload: UpdateMealLoggingDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                // update meal logging 
                const [old_meal_type, updated] = await this.mealLoggingService.updateMealLogging(decoded_headers, payload, transactionalEntityManager);

                // if there is no update to the meal logging
                if (!updated){
                    // return status OK
                    throw new HttpException("Meal is not updated.", HttpStatus.OK);
                }
                else {
                    // update meal logging summary 
                    await this.mealLoggingSummaryService.updateMealLoggingSummary(decoded_headers, payload, old_meal_type, transactionalEntityManager);
                }
            });
            return new HttpException("Meal is updated.", HttpStatus.OK);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
    }

    /**
     * Delete method to delete meal planning entries
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains the DTO
     * @returns HttpException 200 when the meal is deleted 
     */
    @Delete('delete')
    async delete(@Headers() headers: any, @Body() payload: DeleteMealLoggingDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => { 

                // remove from summary
                await this.mealLoggingSummaryService.removeMealLoggingId(decoded_headers,payload,transactionalEntityManager);
                
                // remove from database
                await this.mealLoggingService.deleteMealLogging(decoded_headers, payload, transactionalEntityManager);
            });
            return new HttpException("Meal is deleted.", HttpStatus.OK);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
        
    }
}