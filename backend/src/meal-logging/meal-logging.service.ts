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
        const current_date_time = new Date()
        try {

            // Validate userId
            var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });
            if (!user_object) {
                throw new Error("User not found.");
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
                new_meal_logging.date = current_date_time;
                new_meal_logging.type = mealLoggingDTO.mealType;
                new_meal_logging.is_consumed = true;
                new_meal_logging.portion = recipeJSON.portion;
                new_meal_logging.user = user_object;
                new_meal_logging.recipe = recipe_object;
                new_meal_logging.created_at = current_date_time;
                new_meal_logging.updated_at = current_date_time;

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
                DATE(date) = DATE($1)
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
     * @param mealLoggingIdList - a list of corresponding ids for meal logging
     * @returns delete result of all entries
     */
    async deleteMealLoggingBulk(mealLoggingIdList: Array<string>){
        var delete_entries = []
        const delete_date = new Date();
        try {
            mealLoggingIdList.forEach(async meal_logging_id => {
                var entry = await this.mealLoggingRepository.findOneBy({id: meal_logging_id});
                entry.deleted_at = delete_date;
                delete_entries.push(entry);
            })
            await this.mealLoggingRepository.save(delete_entries);
            return true;
        }
        catch (e){
            return e;
        }
    }
    

    /**
     * Mark the meal consumed 
     * @param mealLoggingId - unique id of the meal
     * @returns true after the entry is saved to the database
     */
    async markIsConsumed(mealLoggingId: string){
        try {
            var entry = await this.mealLoggingRepository.findOneBy({id: mealLoggingId});
            if (!entry) {
                throw new Error(`Recipe with id ${mealLoggingId} not found`);
            }
            entry.is_consumed = true;
            await this.mealLoggingRepository.save(entry);
        }
        catch (e){
            throw e;
        }
        finally {
            return true;
        }
    }

    /**
     * Update the meal logging to a different day
     * @param mealLoggingId - meal logging id  
     * @param newDate - new date to change to 
     * @returns the updated meal logging object
     */
    async updateMealLogging(payload: UpdateMealLoggingDTO){
        try {
            const today_date = new Date();
            const newDate = new Date(payload.newDate);
            // validate date 
            if (!this.isPlanning(newDate, today_date)){
                throw new Error("Cannot edit today or past meals.");
            }

            // validate meal logging id 
            var meal_logging_object = await this.mealLoggingRepository.findOneBy({id: payload.mealLoggingId});
            if (!meal_logging_object) {
                throw new Error(`Meal logging with id ${meal_logging_object} not found`);
            }

            // update the meal logging object
            meal_logging_object.date = newDate;
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
    isPlanning(newDate: Date, todayDate: Date) {
        const one_day_in_millis = 8.64e+7; // Number of milliseconds in one day

        // Check if the incoming date is at least one day ahead of today_date
        if (newDate.getTime() - todayDate.getTime() >= one_day_in_millis) {
            return true;
        }

        return false;
    }
}