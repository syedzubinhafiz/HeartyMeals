import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";
import { CommonService } from "src/common/common.service";
import { UpdateMealLoggingDTO } from "./dto/update-meal-logging-dto";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { DeleteMealLoggingDTO } from "./dto/delete-meal-logging-dto";
import { MealLogSummaryService } from "src/meal-log-summary/meal-log-summary.service";
import { GetMealLoggingDTO } from "./dto/get-meal-logging-dto";
import { MarkMealConsumedDTO } from "./dto/mark-meal-consumed-dto";
import { StorageService } from "src/storage/storage.service";
import { Storage } from "src/storage/storage.entity";

@Controller('meal-logging')
export class MealLoggingController {
    constructor(
        private mealLoggingService: MealLoggingService,
        private commonService: CommonService,
        private storageService: StorageService,
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
    async getMealsPerDay(@Headers() headers, @Query() payload: GetMealLoggingDTO){
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

            // get the thumnails
            const storage_ids = [];
            // for each date
            for (const date in meals) {
                const meals_in_a_day = meals[date].meals;
                // for each meal type
                for (const meal_type in meals_in_a_day) {
                    // for each meal in meal type
                    meals_in_a_day[meal_type].forEach(meal => {
                        // push storage_id
                        storage_ids.push(meal.recipe.storage_links.thumbnail);
                    });
                }
            }

            // get storage entries
            const storage_entries = await this.storageService.getLink(storage_ids) as Storage[];

            // map the storage id with its link
            const storage_map = {};
            storage_entries.forEach(storage => {
                storage_map[storage.storage_id] = storage.link; 
            });

            // replace the storage id with the link
            // for each date
            for (const date in meals) {
                const meals_in_a_day = meals[date].meals;
                // for each meal type
                for (const meal_type in meals_in_a_day) {
                    // for each meal in meal type
                    meals_in_a_day[meal_type].forEach(meal => {
                        if (meal.recipe && meal.recipe.storage_links && meal.recipe.storage_links.thumbnail) {
                            // replace storage_id with link
                            const thumbnail_id = meal.recipe.storage_links.thumbnail;
                            meal.recipe.storage_links.thumbnail = storage_map[thumbnail_id]; 
                        }
                    });
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
    async updateMealLogging(@Headers() headers, @Body() payload: UpdateMealLoggingDTO){
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
     * Post method to delete meal logging entries
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains the DTO
     * @returns HttpException 200 when the meal is deleted 
     */
    @Delete('delete')
    async delete(@Headers() headers, @Body() payload: DeleteMealLoggingDTO){
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

    /**
     * Post method to mark meal is consumed
     * @param payload - payload that contains the meal logging id
     * @returns HttpException 200 when the meal is marked as consumed
     */
    @Post('mark_consume')
    async markConsume(@Body() payload: MarkMealConsumedDTO){
        try {
            await this.mealLoggingService.markMealConsumed(payload);

            return new HttpException("Meal is consumed.", HttpStatus.OK);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
        
    }
}