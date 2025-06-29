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
import { MealLogging } from "./meal-logging.entity";
import { MealLogSummary } from "src/meal-log-summary/meal-log-summary.entity";
import { Between } from "typeorm";

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

            // get the thumnails
            const storage_ids = [];
            const direct_urls = new Map(); // Map to store meals with direct URLs
            
            // for each date
            for (const date in meals) {
                const meals_in_a_day = meals[date].meals;
                // for each meal type
                for (const meal_type in meals_in_a_day) {
                    // for each meal in meal type
                    meals_in_a_day[meal_type].forEach(meal => {
                        if (meal.recipe && meal.recipe.storage_links && meal.recipe.storage_links.thumbnail) {
                            const thumbnail = meal.recipe.storage_links.thumbnail;
                            
                            // Check if thumbnail is a direct URL (Pixabay or other image URLs)
                            if (typeof thumbnail === 'string' && (thumbnail.startsWith('http') || thumbnail.includes('pixabay.com'))) {
                                // Store the meal reference with its direct URL
                                direct_urls.set(meal, thumbnail);
                            } else {
                                // Assume it's a storage UUID
                                storage_ids.push(thumbnail);
                            }
                        }
                    });
                }
            }

            // Handle storage UUIDs if any exist
            if (storage_ids.length > 0){
                try {
                    // get storage entries
                    const storage_entries = await this.storageService.getLink(storage_ids) as Storage[];

                    // map the storage id with its link
                    const storage_map = {};
                    storage_entries.forEach(storage => {
                        storage_map[storage.storage_id] = storage.link; 
                    });

                    // replace the storage id with the link for UUID-based thumbnails
                    for (const date in meals) {
                        const meals_in_a_day = meals[date].meals;
                        for (const meal_type in meals_in_a_day) {
                            meals_in_a_day[meal_type].forEach(meal => {
                                if (meal.recipe && meal.recipe.storage_links && meal.recipe.storage_links.thumbnail) {
                                    const thumbnail_id = meal.recipe.storage_links.thumbnail;
                                    
                                    // Only process if it's not a direct URL
                                    if (!direct_urls.has(meal) && storage_map[thumbnail_id]) {
                                        meal.recipe.storage_links.thumbnail = storage_map[thumbnail_id]; 
                                    }
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.warn('Warning: Failed to fetch storage links for some thumbnails:', error.message);
                    // Continue execution - direct URLs will still work
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
     * Delete method to delete meal logging entries
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

    /**
     * Debug endpoint to repair data synchronization issues
     * @param headers - headers that contains the authorization token
     * @returns HttpException with repair results
     */
    @Post('repair-data')
    async repairData(@Headers() headers: any){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                // Get all MealLogging entries for this user
                const userId: string = typeof decoded_headers['sub'] === 'function' 
                    ? decoded_headers['sub']() 
                    : decoded_headers['sub'];
                
                console.log(`Debug: User ID from JWT: ${userId}, type: ${typeof userId}`);
                
                // Validate that userId is a proper UUID format
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(userId)) {
                    throw new HttpException(`Invalid user ID format: ${userId}. Expected UUID format.`, HttpStatus.BAD_REQUEST);
                }
                
                const user = await transactionalEntityManager.findOne('User', { 
                    where: { user_id: userId } 
                });
                
                if (!user) {
                    throw new HttpException(`User not found with ID: ${userId}`, HttpStatus.NOT_FOUND);
                }
                
                const mealLoggingEntries = await transactionalEntityManager.find(MealLogging, {
                    where: { user: user },
                    relations: ['user', 'recipe'],
                    order: { consumed_date_time: 'ASC' }
                });

                console.log(`Found ${mealLoggingEntries.length} meal logging entries to verify`);

                let repairedCount = 0;
                let issuesFound = 0;

                // Group entries by date
                const entriesByDate = mealLoggingEntries.reduce((acc, entry) => {
                    const date = entry.consumed_date_time.toISOString().split('T')[0];
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(entry);
                    return acc;
                }, {});

                // Check each date for synchronization issues
                for (const [dateStr, entries] of Object.entries(entriesByDate)) {
                    const startOfDay = new Date(dateStr + 'T00:00:00.000Z');
                    const endOfDay = new Date(dateStr + 'T23:59:59.999Z');

                    // Find or create MealLogSummary entry for this date
                    let summaryEntry = await transactionalEntityManager.findOne(MealLogSummary, {
                        where: {
                            user: user,
                            date: Between(startOfDay, endOfDay)
                        },
                        relations: ['user']
                    });

                    if (!summaryEntry) {
                        // Create missing summary entry
                        console.log(`Creating missing MealLogSummary for date: ${dateStr}`);
                        summaryEntry = await this.mealLoggingSummaryService.createMealLoggingSummary(
                            entries[0].user,
                            startOfDay,
                            transactionalEntityManager
                        );
                        repairedCount++;
                    }

                    // Check if all meal entries are properly represented in food_consumed
                    let needsRecalculation = false;
                    
                    for (const entry of entries as MealLogging[]) {
                        let found = false;
                        const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Other'];
                        
                        for (const mealType of mealTypes) {
                            if (summaryEntry.food_consumed[mealType]?.includes(entry.id)) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            console.log(`Found orphaned meal entry: ${entry.id} (${entry.type}) for date ${dateStr}`);
                            
                            // Add the meal to the correct meal type array
                            if (!summaryEntry.food_consumed[entry.type]) {
                                summaryEntry.food_consumed[entry.type] = [];
                            }
                            summaryEntry.food_consumed[entry.type].push(entry.id);
                            needsRecalculation = true;
                            repairedCount++;
                            issuesFound++;
                        }
                    }

                    // Recalculate nutrition budget for this date if needed
                    if (needsRecalculation) {
                        console.log(`Recalculating nutrition budget for date: ${dateStr}`);
                        await this.mealLoggingSummaryService.calculateNutritionBudget(
                            entries[0].user,
                            summaryEntry,
                            transactionalEntityManager
                        );
                        await transactionalEntityManager.save(summaryEntry);
                    }
                }

                console.log(`Data repair completed. Issues found: ${issuesFound}, Items repaired: ${repairedCount}`);
            });

            return new HttpException("Data synchronization repair completed successfully.", HttpStatus.OK);
        }
        catch (e){
            console.error('Error during data repair:', e);
            return new HttpException(`Data repair failed: ${e.message}`, e.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Post method to mark meal is consumed
     * @param payload - payload that contains the meal logging id
     * @returns HttpException 200 when the meal is marked as consumed
     */
    @Post('mark_consume')
    async markConsume(@Headers() headers: any, @Body() payload: MarkMealConsumedDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                // Mark meal as consumed
                const updatedMeal = await this.mealLoggingService.markMealConsumed(payload, transactionalEntityManager);
                
                // Get the meal details to find which summary entry to update
                const mealEntry = await transactionalEntityManager.findOne(MealLogging, {
                    where: { id: payload.mealLoggingId },
                    relations: ['user']
                });
                
                if (mealEntry) {
                    // Find the meal log summary entry for this date
                    const mealDate = new Date(mealEntry.consumed_date_time);
                    const startOfDay = new Date(mealDate);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(mealDate);
                    endOfDay.setHours(23, 59, 59, 999);
                    
                    const summaryEntry = await transactionalEntityManager.createQueryBuilder(MealLogSummary, 'summary')
                        .where('summary.user_id = :userId', { userId: decoded_headers['sub'] })
                        .andWhere('summary.date >= :startOfDay AND summary.date <= :endOfDay', { 
                            startOfDay: startOfDay.toISOString(),
                            endOfDay: endOfDay.toISOString()
                        })
                        .getOne();
                    
                    if (summaryEntry) {
                        // Recalculate nutrition budget to reflect the consumed meal
                        await this.mealLoggingSummaryService.calculateNutritionBudget(
                            mealEntry.user, 
                            summaryEntry, 
                            transactionalEntityManager
                        );
                    }
                }
            });

            return new HttpException("Meal is consumed.", HttpStatus.OK);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
        
    }


}