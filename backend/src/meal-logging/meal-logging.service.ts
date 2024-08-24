import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogging } from "./meal-logging.entity";
import { Repository } from "typeorm";
import { MealType } from "../meal-type.enum";
import { User } from "src/user/user.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { Visibility } from "src/recipe/enum/visibility.enum";

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
     * @param userId - a valid user id
     * @param recipeList - a list of recipes with {recipe_id, portion}
     * @param mealType - the meal type the meal is supposed to be log
     * @returns a list of meal logging objects
     */
    async addMealLogging(userId, recipeList, mealType){
        try {
            // validate userId
            const user_object = await this.userRepository.findOneBy({user_id: userId});

            // validate meal type
            const meal_type_enum = this.getMealTypeEnum(mealType);
            if (meal_type_enum == undefined) return new Error("Meal type is undefined.");

            // validate all recipeIds, while creating all objects
            var all_entries = []
            const current_date_time = new Date()
            recipeList.map( async recipeJSON => {
                const recipe_object = await this.recipeRepository.findOneBy({ id: recipeJSON.recipe_id });

                var new_meal_logging = new MealLogging();
                new_meal_logging.date = current_date_time;
                new_meal_logging.type = meal_type_enum;
                new_meal_logging.is_consumed = true;
                new_meal_logging.portion = recipeJSON.portion;
                new_meal_logging.user = user_object;
                new_meal_logging.recipe = recipe_object;
                new_meal_logging.created_at = current_date_time;
                new_meal_logging.updated_at = current_date_time;

                all_entries.push(new_meal_logging)
            })

            return await this.mealLoggingRepository.save(all_entries);
        } catch (e) {
            return e;
        }
    }


    /**
     * Get all the meals of a user in a specific day
     * @param userId - valid user id
     * @param date - date 
     * @returns a list of lists of meals 
     */
    async getMealsPerDay(date: Date){
        try {
            // get all the meals recoreded in a dayz
            var entries = await this.mealLoggingRepository.find({
                where: {
                    date: date
                }
            })
        }
        catch (e){
            return e;
        }

        // sort them by their meal type
        var sorted = [[], [], [], []];
        entries.forEach(entry => {
            if (entry.type == MealType.BREAKFAST){
                sorted[0].push(entry);
            }
            else if (entry.type == MealType.LUNCH){
                sorted[1].push(entry);
            }
            else if (entry.type == MealType.DINNER){
                sorted[2].push(entry);
            }
            else {
                sorted[3].push(entry);
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
            mealLoggingIdList.map(async meal_logging_id => {
                var entry = await this.mealLoggingRepository.findOneBy({id: meal_logging_id});
                entry.deleted_at = delete_date;
                entry.visibility = Visibility.PRIVATE;
                delete_entries.push(entry);
            })
            return await this.mealLoggingRepository.save(delete_entries);
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
            entry.is_consumed = true;
            return await this.mealLoggingRepository.save(entry);
        }
        catch (e){
            return e;
        }
    }

    /**
     * Update the meal logging to a different day
     * @param mealLoggingId - meal logging id  
     * @param newDate - new date to change to 
     * @returns the updated meal logging object
     */
     async updateMealLoggingDay(mealLoggingId, newDate: Date){
        try {
            // validate date 
            if (!this.isPlanning(newDate)){
                return new Error("Cannot edit today or past meals.");
            }

            // validate meal logging id 
            var meal_logging_object = await this.mealLoggingRepository.findOneBy({id: mealLoggingId});
            meal_logging_object.date = newDate;
            return await this.mealLoggingRepository.save(meal_logging_object);
        } catch (e) {
            return e;
        }
    }

    /**
     * Get meal type 
     * @param value - meal type in string
     * @returns available meal type in enum, or undefined
     */
    getMealTypeEnum<T>(value: string){
        const enumValues = Object.values(MealType);
        return enumValues.includes(value as any) ? (value as T[keyof T]): undefined
    }

    /**
     * Check if the incoming date is still in planning phase
     * @param newDate - incoming date to be validated
     * @returns true if the incoming date is one day ahead of today else false
     */
    isPlanning(newDate) {
        const today_date = new Date();
        const one_day_in_millis = 8.64e+7; // Number of milliseconds in one day
    
        // Check if the incoming date is at least one day ahead of today_date
        if (newDate.getTime() - today_date.getTime() >= one_day_in_millis) {
            return true;
        }

        return false;
    }
}