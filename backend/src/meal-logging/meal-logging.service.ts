import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { formatInTimeZone, fromZonedTime, toDate } from 'date-fns-tz';
import { addDays, endOfDay, format, formatISO, isAfter, isBefore, isSameDay, parseISO, startOfDay }from 'date-fns';
import { MealLogging } from "./meal-logging.entity";
import { EntityManager, In, Repository } from "typeorm";
import { MealType } from "../meal-type.enum";
import { User } from "src/user/user.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { UpdateMealLoggingDTO } from "./dto/update-meal-logging-dto";
import { DeleteMealLoggingDTO } from "./dto/delete-meal-logging-dto";
import { AddMealLoggingSummaryDTO } from "src/meal-log-summary/dto/add-meal-logging-summary-dto";
import { GetMealLoggingDTO } from "./dto/get-meal-logging-dto";
import { MarkMealConsumedDTO } from "./dto/mark-meal-consumed-dto";
import { CommonService } from "src/common/common.service";
import { time } from "console";
import { start } from "repl";

@Injectable()
export class MealLoggingService {
    constructor(
        @InjectRepository(MealLogging)
        private mealLoggingRepository: Repository<MealLogging>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,
        private commonService: CommonService,
    ){}

    /**
     * Log meals based on the meal type
     * @param decodedHeaders - decoded headers from the request
     * @param addMealLoggingSummaryDTO - payload that contains the meal logging details
     * @param transactionalEntityManager - transactional entity manager
     * @returns the saved entries in the database
     * 
     * @example addMealLogging(decodedHeaders, '2021-10-10T12:00:00', '2021-10-10T12:00:00', 'Asia/Singapore', [{recipeId: 1, portion: 1}, {recipeId: 2, portion: 2}], MealType.BREAKFAST, transactionalEntityManager)
     */
    async addMealLogging(decodedHeaders: any, addMealLoggingSummaryDTO: AddMealLoggingSummaryDTO,transactionalEntityManager: EntityManager){
        var all_entries = []
        try {
            // Get user object
            var user_object = await this.userRepository.findOneByOrFail({ user_id: decodedHeaders['sub'] });

            // Validate date - between today and next 7 days
            if (!this.commonService.isWithinDateRange(addMealLoggingSummaryDTO.mealDate, addMealLoggingSummaryDTO.userLocalDateTime, addMealLoggingSummaryDTO.timeZone, 6)){
                throw new HttpException("Cannot add meal loggings for past or future meals.", HttpStatus.BAD_REQUEST);
            };

            // Get all the recipe objects from the recipe ids
            const all_recipe_ids = addMealLoggingSummaryDTO.recipeIdPortions.map(recipeJSON => recipeJSON['recipeId']);
            const recipes_object = await this.recipeRepository.findBy({
                 id: In(all_recipe_ids),
            });

            // Create a map of recipe objects for easy access
            const recipe_map = new Map(recipes_object.map(recipe => [recipe.id, recipe]));

            // get the date in UTC
            const meal_date = fromZonedTime(addMealLoggingSummaryDTO.mealDate, addMealLoggingSummaryDTO.timeZone);
            const user_local_date = fromZonedTime(addMealLoggingSummaryDTO.userLocalDateTime, addMealLoggingSummaryDTO.timeZone);

            // Use Promise.all to ensure all promises are resolved before proceeding with saving the entries
            await Promise.all(addMealLoggingSummaryDTO.recipeIdPortions.map(async recipeJSON => {
                // Validate recipeId
                const recipe_object = recipe_map.get(recipeJSON['recipeId']);
                if (!recipe_object) {
                    throw new HttpException(`Recipe with id ${recipeJSON['recipeId']} not found`, HttpStatus.NOT_FOUND);
                }

                // Create entries to store in saved_entries
                var new_meal_logging = new MealLogging();
                new_meal_logging.consumed_date_time = meal_date;
                new_meal_logging.type = addMealLoggingSummaryDTO.mealType;
                new_meal_logging.portion = recipeJSON['portion'];
                new_meal_logging.user = user_object;
                new_meal_logging.recipe = recipe_object;

                // Check if the meal is consumed or planned
                if (this.commonService.isSameDay(meal_date, user_local_date, addMealLoggingSummaryDTO.timeZone)){
                    // meal logging
                    new_meal_logging.is_consumed = true;
                }
                else {
                    // meal planning
                    new_meal_logging.is_consumed = false;
                }

                
                all_entries.push(new_meal_logging)
            }));

            // Save all recipes in one go
            const saved_entries = await transactionalEntityManager.save(all_entries);

            // Return the ids of the saved entries
            return saved_entries.map(entry => entry.id);
        } catch (e) {
            throw e; // Return error to controller
        }
    }


    /**
     * Get all the meals of a user based on the start and end date
     * 
     * @param decodedHeaders - decoded headers from the request
     * @param getMealLoggingDTO - DTO containing the start and end date
     * @returns a list of lists of meals sorted in meal types
     */
    async getMeals(decodedHeaders: any, getMealLoggingDTO: GetMealLoggingDTO){
        try {
            // Get user object
            var user_object = await this.userRepository.findOneByOrFail({ user_id: decodedHeaders['sub'] });

            // get the start and end of the day 
            const start_of_day = `${getMealLoggingDTO.startDate} 00:00:00`;

            var end_of_day = `${getMealLoggingDTO.endDate} 23:59:59`;
            if (getMealLoggingDTO.endDate == null || getMealLoggingDTO.endDate == undefined){
                end_of_day = `${getMealLoggingDTO.startDate} 23:59:59`;
            }
            
            // get all the meals recoreded in a day using time zone
            var entries = await this.mealLoggingRepository.createQueryBuilder("meal_logging")
                .leftJoinAndSelect("meal_logging.recipe", "recipe")
                .where('meal_logging.consumed_date_time AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay', { timeZone: getMealLoggingDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
                .andWhere("meal_logging.user_id = :user_id", { user_id: user_object.user_id })
                .andWhere("meal_logging.deleted_at IS NULL")
                .orderBy("meal_logging.consumed_date_time", "ASC")
                .getMany();

            // get the date range from startDateTime to endDateTime
            const list_of_dates = this.commonService.listDatesWithTimezone(start_of_day, end_of_day, getMealLoggingDTO.timeZone);
            
            // Group entries by date
            const entries_group_by_date = entries.reduce((acc, entry) => {
                // format to user local timezone
                const date = formatInTimeZone(entry.consumed_date_time, getMealLoggingDTO.timeZone, "yyyy-MM-dd"); // Extract the date part
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(entry);
                return acc;
            }, {});

            var output = {};

            // for each date
            for (const date of list_of_dates){
                // sort them by their meal type
                var sorted = {
                    "Breakfast": [],
                    "Lunch": [],
                    "Dinner": [],
                    "Other": []
                }

                if ((date in entries_group_by_date)){
                    // get the entries for each date
                    // sort by meal type
                    entries_group_by_date[date].forEach(entry => {
                        if (entry.type == MealType.BREAKFAST){
                            sorted["Breakfast"].push(entry);
                        }
                        else if (entry.type == MealType.LUNCH){
                            sorted["Lunch"].push(entry);
                        }
                        else if (entry.type == MealType.DINNER){
                            sorted["Dinner"].push(entry);
                        }
                        else {
                            sorted["Other"].push(entry);
                        }
                    });
                }
                
                output[date] = {
                    'meals': sorted
                };
            }

            return output;
        }
        catch (e){
            throw e;
        }
    }

    /**
     * Delete a list of entries of meal logging
     * @param decodedHeaders - decoded headers from the request
     * @param deleteMealLoggingDTO - DTO containing the list of meal logging ids
     * @returns delete result of all entries
     */
    async deleteMealLogging(decodedHeaders: any, deleteMealLoggingDTO: DeleteMealLoggingDTO, transactionalEntityManager: EntityManager){
        try {
            var entry = await this.mealLoggingRepository.createQueryBuilder("meal_logging")
                .where("meal_logging.id = :id", { id: deleteMealLoggingDTO.mealLoggingId })
                .andWhere("meal_logging.user_id = :user_id", { user_id: decodedHeaders['sub'] })
                .andWhere("meal_logging.deleted_at IS NULL")    
                .getOneOrFail()

            // Soft delete the entry
            entry.deleted_at = fromZonedTime(deleteMealLoggingDTO.mealDate, deleteMealLoggingDTO.timeZone);
            
            await transactionalEntityManager.save(entry);
            return true;
        }
        catch (e){
            throw e;
        }
    }

    /**
     * Update the meal logging to a different day
     * @param decodedHeaders - decoded headers from the request
     * @param payload - payload that contains the meal logging id and the new date
     *  @param transactionalEntityManager - transactional entity manager
     * @returns the updated meal logging object
     */
    async updateMealLogging(decodedHeaders: any, payload: UpdateMealLoggingDTO, transactionalEntityManager: EntityManager): Promise<[MealType, boolean]> {
        try {
            // validate date
            if (!this.commonService.isWithinDateRange(payload.mealDate, payload.userLocalDate, payload.timeZone, 6)){
                throw new HttpException("Cannot update meal loggings for past or future meals.", HttpStatus.BAD_REQUEST);
            }

            if (payload.newMealDate && !this.commonService.isWithinDateRange(payload.newMealDate, payload.userLocalDate, payload.timeZone, 6)){
                throw new HttpException("Cannot meal loggings to a date that is in the past or 7 days in the future.", HttpStatus.BAD_REQUEST);
            }

            // validate meal logging id 
            // returns a list of meal logging objects found
            var entry = await this.mealLoggingRepository.createQueryBuilder("meal_logging")
                .where("meal_logging.id = :id", { id: payload.mealLoggingId })
                .andWhere("meal_logging.user_id = :user_id", { user_id: decodedHeaders['sub'] })
                .getOneOrFail()

            if (entry.portion == payload.portion && entry.type == payload.mealType && (this.commonService.isSameDay(payload.mealDate, payload.newMealDate, payload.timeZone))){
                return [entry.type, false];
            }

            // save the previous meal type
            const old_meal_type = entry.type;

            // update the meal logging object
            entry.updated_at = fromZonedTime(payload.userLocalDate, payload.timeZone);
            entry.portion = payload.portion;
            entry.type = payload.mealType;

            // meal planning - change the consumsed date time to other date
            if (payload.newMealDate){
                entry.consumed_date_time = fromZonedTime(payload.newMealDate, payload.timeZone);
            }

            await transactionalEntityManager.save(entry);
            return [old_meal_type, true];
        } catch (e) {
            throw e;
        }
    }

    /**
     * Mark a meal is consumed
     * @param markMealConsumedDTO - DTO containing the meal logging id and the date time
     * @returns true when the meal is marked consumed
     */
    async markMealConsumed(markMealConsumedDTO: MarkMealConsumedDTO){
        // validate and get meal logging entry
        const entry = await this.mealLoggingRepository.findOneByOrFail({id: markMealConsumedDTO.mealLoggingId, is_consumed: false});

        entry.consumed_date_time = fromZonedTime(markMealConsumedDTO.dateTime, markMealConsumedDTO.timeZone);
        entry.is_consumed = true;

        try {
            await this.mealLoggingRepository.save(entry);
        }
        catch {
            throw new HttpException("Error marking food consumed", HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
    }
}