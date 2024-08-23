import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogging } from "./meal-logging.entity";
import { Repository } from "typeorm";
import { MealType } from "../meal-type.enum";
import { User } from "src/user/user.entity";
import { Recipe } from "src/recipe/recipe.entity";

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
     * @param recipeIdList - a list of recipe ids 
     * @param mealType - the meal type the meal is supposed to be log
     * @returns a list of meal logging objects
     */
    async addMealLogging(userId, recipeIdList, mealType){
        try {
            // validate userId
            var user_object = await this.userRepository.findOneBy({user_id: userId});

            // validate meal type
            const meal_type_enum = this.getMealTypeEnum(mealType);
            if (meal_type_enum == undefined) return new Error("Meal type is undefined.");

            // validate all recipeIds, while creating all objects
            var all_entries = []
            const current_date_time = new Date()
            recipeIdList.map( async recipeId => {
                const recipe_object = await this.recipeRepository.findOneBy({ id: recipeId });

                var new_meal_logging = new MealLogging();
                new_meal_logging.date = current_date_time;
                new_meal_logging.type = meal_type_enum;
                new_meal_logging.is_consumed = true;
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
    async getMealsPerDay(userId, date){
        try {
            // get all the meals recoreded in a dayz
            var entries = await this.mealLoggingRepository.find({
                where: {
                    user: userId,
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
     * Mark the meal consumed 
     * @param mealLoggingId - unique id of the meal
     * @returns true after the entry is saved to the database
     */
    async markIsConsumed(mealLoggingId){
        try {
            var entry = await this.mealLoggingRepository.findOneBy({id: mealLoggingId});
        }
        catch (e){
            return e;
        }

        entry.is_consumed = true;
        await this.mealLoggingRepository.save(entry);
        return true;
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
}