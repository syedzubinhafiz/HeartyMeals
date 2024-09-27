import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { formatInTimeZone, toDate } from 'date-fns-tz';
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

@Injectable()
export class MealLoggingService {
    constructor(
        @InjectRepository(MealLogging)
        private mealLoggingRepository: Repository<MealLogging>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,
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
            if (!this.isValidMealDate(addMealLoggingSummaryDTO.mealDateTime, addMealLoggingSummaryDTO.systemDateTime, addMealLoggingSummaryDTO.timeZone)){
                throw new HttpException("Cannot add meal loggings for past or future meals.", HttpStatus.BAD_REQUEST);
            };

            // get the date in ISO format (with timezone into account)
            const meal_date = new Date(this.getISOStringWithTimezone(addMealLoggingSummaryDTO.mealDateTime, addMealLoggingSummaryDTO.timeZone));

            // Get all the recipe objects from the recipe ids
            const all_recipe_ids = addMealLoggingSummaryDTO.recipeIdPortions.map(recipeJSON => recipeJSON['recipeId']);
            const recipes_object = await this.recipeRepository.findBy({
                 id: In(all_recipe_ids),
            });

            // Create a map of recipe objects for easy access
            const recipeMap = new Map(recipes_object.map(recipe => [recipe.id, recipe]));

            // Use Promise.all to ensure all promises are resolved before proceeding with saving the entries
            await Promise.all(addMealLoggingSummaryDTO.recipeIdPortions.map(async recipeJSON => {
                // Validate recipeId
                const recipe_object = recipeMap.get(recipeJSON['recipeId']);
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

                if (addMealLoggingSummaryDTO.mealDateTime === addMealLoggingSummaryDTO.systemDateTime){
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
     * @param startDate - start date requested to get the meals from
     * @param endDate - end date requested to get the meals from
     * @param timeZone - timezone of the user
     * @returns a list of lists of meals sorted in meal types
     */
    async getMeals(decodedHeaders: any, getMealLoggingDTO: GetMealLoggingDTO){
        try {
            // Get user object
            var user_object = await this.userRepository.findOneByOrFail({ user_id: decodedHeaders['sub'] });

            // get the start and end of the day 
            const start_of_day = `${getMealLoggingDTO.startDate} 00:00:00`;

            var end_date = getMealLoggingDTO.endDate;
            if (getMealLoggingDTO.endDate === null){
                end_date = getMealLoggingDTO.startDate;
            }

            const end_of_day = `${end_date} 23:59:59`;
            
            // get all the meals recoreded in a day using time zone
            var entries = await this.mealLoggingRepository.createQueryBuilder("meal_logging")
                .leftJoinAndSelect("meal_logging.recipe", "recipe")
                .where('meal_logging.consumed_date_time AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay', { timeZone: getMealLoggingDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
                .andWhere("meal_logging.user_id = :user_id", { user_id: user_object.user_id })
                .andWhere("meal_logging.deleted_at IS NULL")
                .orderBy("meal_logging.consumed_date_time", "ASC")
                .getMany();
        }
        catch (e){
            throw e;
        }

        // Group entries by date
        const entries_group_by_date = entries.reduce((acc, entry) => {
            const date = entry.consumed_date_time.toISOString().split('T')[0]; // Extract the date part
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(entry);
            return acc;
        }, {});

        var output = [];

        // for each date
        for (const date in entries_group_by_date){
            // sort them by their meal type
            var sorted = {
                "Breakfast": [],
                "Lunch": [],
                "Dinner": [],
                "Other": []
            }

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
            output.push({
                'date': date,
                'meals': sorted
            });
        }

        return output;
    }

    /**
     * Delete a list of entries of meal logging
     * @param decodedHeaders - decoded headers from the request
     * @param mealLoggingIdList - a list of corresponding ids for meal logging
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
            entry.deleted_at = new Date(this.getISOStringWithTimezone(deleteMealLoggingDTO.mealDate, deleteMealLoggingDTO.timeZone));
            
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
    async updateMealLogging(decodedHeaders: any, payload: UpdateMealLoggingDTO, transactionalEntityManager: EntityManager){
        try {
            // validate date
            if (!this.isValidMealDate(payload.mealDate, payload.systemDate, payload.timeZone)){
                throw new HttpException("Cannot update meal loggings for past or future meals.", HttpStatus.BAD_REQUEST);
            }

            if (payload.newMealDate && !this.isValidMealDate(payload.newMealDate, payload.systemDate, payload.timeZone)){
                throw new HttpException("Cannot meal loggings to a date that is in the past or 7 days in the future.", HttpStatus.BAD_REQUEST);
            }

            // validate meal logging id 
            // returns a list of meal logging objects found
            var entry = await this.mealLoggingRepository.createQueryBuilder("meal_logging")
                .where("meal_logging.id = :id", { id: payload.mealLoggingId })
                .andWhere("meal_logging.user_id = :user_id", { user_id: decodedHeaders['sub'] })
                .getOneOrFail()

            // save the previous meal type
            const old_meal_type = entry.type;

            // update the meal logging object
            entry.updated_at = new Date(this.getISOStringWithTimezone(payload.mealDate, payload.timeZone));
            entry.portion = payload.portion;
            entry.type = payload.mealType;

            // meal planning - change the consumsed date time to other date
            if (payload.newMealDate){
                entry.consumed_date_time = new Date(this.getISOStringWithTimezone(payload.newMealDate, payload.timeZone));
            }

            await transactionalEntityManager.save(entry);
            return old_meal_type;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Mark a meal is consumed
     * @param mealLoggingId - meal logging id of the meal
     * @returns true when the meal is marked consumed
     */
    async markMealConsumed(mealLoggingId: string){
        // validate and get meal logging entry
        const entry = await this.mealLoggingRepository.findOneByOrFail({id: mealLoggingId, is_consumed: false});

        entry.is_consumed = true;

        try {
            await this.mealLoggingRepository.save(entry);
            return true;
        }
        catch {
            throw new HttpException("Error marking food consumed", HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
    }
    
    /**
     * Get the ISO string with timezone (NOT UTC)
     * @param date - date string in the format YYYY-MM-DDTHH:MM:SS.SSS or YYYY-MM-DD
     * @param timeZone - timezone string
     * @returns formatted date string with timezone yyyy-MM-dd'T'HH:mm:ssXXX
     * 
     * @example getISOStringWithTimezone('2021-10-10', 'Asia/Singapore') => '2021-10-10T00:00:00+08:00'
     * @example getISOStringWithTimezone('2021-10-10T12:00:00', 'Asia/Singapore') => '2021-10-10T12:00:00+08:00'
     */
    getISOStringWithTimezone(date: string, timeZone: string): string {
        return formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    }

    /**
     * Check if the date is within 7 days from now and today
     * @param mealDateTime - date string in the format YYYY-MM-DDTHH:MM:SS.SSS or YYYY-MM-DD
     * @param systemDateTime - date string in the format YYYY-MM-DDTHH:MM:SS.SSS or YYYY-MM-DD
     * @param timeZone - timezone string
     * @returns true if the date is within 7 days from now and today
     */
    isValidMealDate(mealDateTime: string, systemDateTime: string, timeZone: string): boolean {
        const meal_date = parseISO(mealDateTime);
        const zoned_meal_date = toDate(meal_date.toISOString(), { timeZone });

        const system_date = parseISO(systemDateTime);
        const zoned_system_date = toDate(system_date.toISOString(), { timeZone });

        const six_days_from_now = addDays(zoned_system_date, 6);
      
        const is_past = isBefore(zoned_meal_date, zoned_system_date);
        const is_beyond_six_days = isAfter(zoned_meal_date, six_days_from_now);
      
        return !is_past && !is_beyond_six_days;
    }

    /**
     * Check if the two dates are the same day
     * @param todayDate - today's date
     * @param date - date string in the format YYYY-MM-DDTHH:MM:SS.SSS or YYYY-MM-DD
     * @param timeZone - timezone string
     * @returns true if the two dates are the same day
     */
    isSameDay(todayDate: string = null, date: string, timeZone: string): boolean {
        if (!todayDate) {
            todayDate = date;
        }

        const parsed_today = new Date(this.getISOStringWithTimezone(todayDate, timeZone));
        const parsed_date = new Date(this.getISOStringWithTimezone(date, timeZone));

        return isSameDay(parsed_date, parsed_today);
    }
}