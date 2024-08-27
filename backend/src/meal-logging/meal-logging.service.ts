import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogging } from "./meal-logging.entity";
import { In, Repository } from "typeorm";
import { MealType } from "../meal-type.enum";
import { User } from "src/user/user.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { AddMealLoggingDTO } from "./dto/add-meal-logging-dto";
import { UpdateMealLoggingDTO } from "./dto/update-meal-logging-dto";

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
     * @param mealLoggingDTO - DTO containing the meal type and recipe ids
     * @returns the saved entries in the database
     */
    async addMealLogging(decodedHeaders: any, mealLoggingDTO: AddMealLoggingDTO){
        var all_entries = []
        try {

            // Validate userId
            var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });
            if (!user_object) {
                throw new Error("User not found.");
            }

            // Validate date 
            const meal_date = new Date(mealLoggingDTO.mealDate);
            const result = this.checkDate(meal_date);
            if (result.editable == false){ 
                // Cannot edit past or future meals
                throw result.message; 
            } 

            const all_recipe_ids = mealLoggingDTO.recipeIds.map(recipeJSON => recipeJSON.recipeId);

            const recipes_object = await this.recipeRepository.findBy({
                 id: In(all_recipe_ids),
            });

            const recipeMap = new Map(recipes_object.map(recipe => [recipe.id, recipe]));

            // Use Promise.all to ensure all promises are resolved before proceeding with saving the entries
            const results = await Promise.all(mealLoggingDTO.recipeIds.map(async recipeJSON => {
                // Validate recipeId
                const recipe_object = recipeMap.get(recipeJSON.recipeId);
                if (!recipe_object) {
                    throw new Error(`Recipe with id ${recipeJSON.recipeId} not found`);
                }

                // Create entries to store in saved_entries
                var new_meal_logging = new MealLogging();
                new_meal_logging.consumed_date_time = meal_date;
                new_meal_logging.is_consumed = false;
                new_meal_logging.type = mealLoggingDTO.mealType;
                new_meal_logging.portion = recipeJSON.portion;
                new_meal_logging.user = user_object;
                new_meal_logging.recipe = recipe_object;
                new_meal_logging.created_at = new Date();
                new_meal_logging.updated_at = new Date();

                all_entries.push(new_meal_logging)
            }));

            // Save all recipes in one go
            return await this.mealLoggingRepository.save(all_entries);
        } catch (e) {
            throw e; // Return error to controller
        }
    }


    /**
     * Get all the meals of a user in a specific day
     * @param decodedHeaders - decoded headers from the request
     * @param date - date string in the format YYYY-MM-DDTHH:MM:SS.SSS 
     * @returns a list of lists of meals 
     */
    async getMealsPerDay(decodedHeaders: any, date: string){
        try {
            // Validate userId
            var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });
            if (!user_object) {
                throw new Error("User not found.");
            }

            // Validate date format
            const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/;
            if (!pattern.test(date)){
                throw new Error("Date must be in the format YYYY-MM-DDTHH:MM:SS.SSS");
            }
            const new_date = new Date(date);
            
            // get all the meals recoreded in a day
            var entries = await this.mealLoggingRepository.query(`
                SELECT * FROM meal_logging
                WHERE 
                DATE(consumed_date_time) = DATE($1)
                AND user_id = $2
                AND deleted_at IS NULL
            `, [new_date, user_object.user_id]);
            
            }
        catch (e){
            throw e;
        }

        // sort them by their meal type
        var sorted = {
            "Breakfast": [],
            "Lunch": [],
            "Dinner": [],
            "Other": []
        }
        entries.forEach(entry => {
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
        return sorted;
    }

    /**
     * Delete a list of entries of meal logging
     * @param decodedHeaders - decoded headers from the request
     * @param mealLoggingIdList - a list of corresponding ids for meal logging
     * @returns delete result of all entries
     */
    async deleteMealLoggingBulk(decodedHeaders: any, mealLoggingIdList: Array<string>){
        var delete_entries = []
        const delete_date = new Date();
        try {
            // Validate userId
            var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });
            if (!user_object) {
                throw new Error("User not found.");
            }

            var entries = await this.mealLoggingRepository.query(`
                SELECT * FROM meal_logging
                WHERE 
                id = ANY($1)
                AND user_id = $2
                AND deleted_at IS NULL
                AND is_consumed = false
            `, [mealLoggingIdList, user_object.user_id]);
            if (entries.length != mealLoggingIdList.length){ throw new Error("Some meal logging entries are not found or already consumed."); }

            entries.forEach(async meal_logging_object => {
                // Check if meal can be deleted
                const result = this.checkDate(meal_logging_object.consumed_date_time);
                if (result.editable == false){ throw result.message; }

                meal_logging_object.deleted_at = delete_date;
                delete_entries.push(meal_logging_object);
            })
            await this.mealLoggingRepository.save(delete_entries);
            return true;
        }
        catch (e){
            throw e;
        }
    }
    

    /**
     * Mark the meal consumed 
     * @param decodedHeaders - decoded headers from the request
     * @param mealLoggingId - meal logging id
     * @returns true after the entry is saved to the database
     */
    async markIsConsumed(decodedHeaders: any, mealLoggingId: string){
        try {
            // Validate userId
            var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });
            if (!user_object) {
                throw new Error("User not found.");
            }

            var entry = await this.mealLoggingRepository.query(`
                SELECT * FROM meal_logging
                WHERE 
                id = $1
                AND user_id = $2
                AND deleted_at IS NULL
                AND is_consumed = false
            `, [mealLoggingId, user_object.user_id]);
            if (entry.length == 0){ 
                throw new Error(`Meal logging with id ${mealLoggingId} not found`);
            }
            var entry = entry[0];
            // Check if meal can be marked as consumed
            // use consumed date time to check
            const result = this.checkDate(entry.consumed_date_time);
            if (result.editable == true && result.planning == false){ 
                entry.is_consumed = true;
                entry.updated_at = new Date();
                await this.mealLoggingRepository.save(entry);
                return true; 
            }
            else { throw new Error(result.message); }
        }
        catch (e){
            throw e;
        }
    }

    /**
     * Update the meal logging to a different day
     * @param payload - payload that contains the meal logging id and the new date
     * @returns the updated meal logging object
     */
    async updateMealLogging(payload: UpdateMealLoggingDTO){
        try {
            const newDate = new Date(payload.newDate);
            // validate date 
            const result = this.checkDate(newDate);
            if (result.editable == false){ throw new Error (result.message); }

            // validate meal logging id 
            // returns a list of meal logging objects found
            var meal_logging_object = await this.mealLoggingRepository.query(`
                SELECT * FROM meal_logging
                WHERE 
                id = $1
            `, [payload.mealLoggingId]);
            if (meal_logging_object.length == 0) {
                throw new Error(`Meal logging with id ${meal_logging_object} not found`);
            }
            meal_logging_object = meal_logging_object[0];
            // update the meal logging object
            meal_logging_object.updated_at = new Date();
            meal_logging_object.consumed_date_time = newDate;
            meal_logging_object.portion = payload.portion;
            meal_logging_object.type = payload.mealType;

            await this.mealLoggingRepository.save(meal_logging_object);
            return true;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Check if the incoming date is still in planning phase
     * @param newDate - incoming date to be validated
     * @returns true if the incoming date is one day ahead of today else false
     */
    checkDate(newDate: Date) {
        const today_date_in_number = new Date().setHours(0, 0, 0, 0);
        const one_day_in_millis = 8.64e+7; // Number of milliseconds in one day
        const seven_days_in_millis = 6.048e+8; // Number of milliseconds in seven days

        // Check if the incoming date is more than 7 days ahead of today_date
        if (newDate.getTime() - today_date_in_number > seven_days_in_millis) {
            return {
                editable: false,
                planning: false,
                message: "Cannot edit meals more than 7 days ahead."
            };
        }

        // Check if the incoming date is at least one day ahead of today_date
        if ((newDate.getTime() - today_date_in_number >= one_day_in_millis) && (newDate.getTime() - today_date_in_number <= seven_days_in_millis)) {
            return {
                editable: true,
                planning: true,
                message: "Planning meals."
            };
        }

        if (newDate.getTime() - today_date_in_number > 0 && newDate.getTime() - today_date_in_number < one_day_in_millis) {
            return {
                editable: true,
                planning: false,
                message: "Today meals."
            };
        } 

        // Check if the incoming date is in the past
        if (newDate.getTime() - today_date_in_number <= 0) {
            return {
                editable: false,
                planning: false,
                message: "Cannot edit past meals."
            };
        }
    }
}