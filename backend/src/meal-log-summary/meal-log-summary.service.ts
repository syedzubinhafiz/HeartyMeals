import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { In, Repository } from "typeorm";
import { CalculateMealLoggingSummaryDTO } from "./dto/calculate-meal-logging-summary-dto";
import { User } from "src/user/user.entity";
import { MealLogging } from "src/meal-logging/meal-logging.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { CommonService } from "src/common/common.service";
import { UserService } from "src/user/user.service";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";
import { CreateMealLoggingSummaryDTO } from "./dto/create-meal-logging-summary-entry-dto";

@Injectable()
export class MealLogSummaryService {
    constructor(
        @InjectRepository(MealLogSummary)
        private mealLogSummaryRepository: Repository<MealLogSummary>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(MealLogging)
        private mealLoggingRepository: Repository<MealLogging>,
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,
        private commonService: CommonService,
        private userService: UserService,
    ){}

    async createMealLoggingSummary(decodedHeaders: any, createMealLoggingSummaryDTO: CreateMealLoggingSummaryDTO){
        // Validate userId
        if (!await this.userService.verifyUser(decodedHeaders)) { throw new Error(`User with id ${decodedHeaders['sub']} not found`); }
        const user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });

        // get the date only
        const meal_logging_summary_date = new Date(createMealLoggingSummaryDTO.mealDate.split('T')[0]);

        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('date = :meal_date', {meal_date: meal_logging_summary_date})
            .getOne();

        if (!meal_logging_summary_entry || meal_logging_summary_entry == null) {
            meal_logging_summary_entry = new MealLogSummary();
            meal_logging_summary_entry.user = user_object;
            meal_logging_summary_entry.date = meal_logging_summary_date;
            // save the food consumed in the meal logging summary
            meal_logging_summary_entry.food_consumed = createMealLoggingSummaryDTO.mealLoggingIdsInJSON;
        }
        else {
            var previous_food_consumed = meal_logging_summary_entry.food_consumed;
            // Loop through each key (Breakfast, Lunch, Dinner, Other) in the object
            for (const key in createMealLoggingSummaryDTO.mealLoggingIdsInJSON) {
                // Loop through each item in the array associated with the key
                createMealLoggingSummaryDTO.mealLoggingIdsInJSON[key].forEach((item) => {
                    // Add them into the object
                    previous_food_consumed[key].push(item);
                });
            }
            meal_logging_summary_entry.food_consumed = previous_food_consumed;
        }

        meal_logging_summary_entry.remaining_nutrients = createMealLoggingSummaryDTO.nutritionAfter;

        try {
            await this.mealLogSummaryRepository.save(meal_logging_summary_entry);
        }
        catch (e) {
            throw new HttpException(e, 400);
        }

    }

    /**
     * Calculate the nutrition info before logging the meal after logging the meal
     * @param decodedHeaders - headers from request
     * @param calculateMealLoggingSummaryDTO - DTO containing the meals that user selected and portion
     * @returns [nutrition_before, nutrition_after], a list of the nutrition before and after logging the meals
     */
    async calculateNutritionSummary(decodedHeaders: any, calculateMealLoggingSummaryDTO: CalculateMealLoggingSummaryDTO){
        try {
            // Validate userId
            if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, 400); }
            var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });

            // combine multiple lists of meal logging ids into one big lists of meal looging ids
            const combined_meals = [
                ...calculateMealLoggingSummaryDTO.recipeIdsInJSON.Breakfast, 
                ...calculateMealLoggingSummaryDTO.recipeIdsInJSON.Lunch, 
                ...calculateMealLoggingSummaryDTO.recipeIdsInJSON.Dinner, 
                ...calculateMealLoggingSummaryDTO.recipeIdsInJSON.Other
            ];

            // get list of recipe ids
            const recipe_ids = combined_meals.map(json_object => json_object.recipeId);

            // get all the meal logging objects
            const recipe_id_portion_list = await this.recipeRepository.find({
                where: {
                    id: In(recipe_ids)
                }
            });

            const recipe_object_portion_list = [];

            // combine the recipe id, nutrition info and portion into one list
            combined_meals.forEach(meal => {
                const recipe = recipe_id_portion_list.find(r => r.id === meal.recipeId);
                if (recipe) {
                    recipe_object_portion_list.push({
                        recipe_id: meal.recipeId,
                        nutrition_info: recipe.nutrition_info, 
                        portion: meal.portion 
                    });
                }
                else {
                    throw new HttpException (`Recipe with id ${meal.recipeId} not found.`, 404);
                }
            });

            // get the remaining budget of the user for the day    
            const nutrition_before = await this.getRemainingBudget(decodedHeaders, {"date": calculateMealLoggingSummaryDTO.mealDate});

            // calculate the nutrition if the user plan to eat the meal
            const nutrition_after = this.commonService.calculateNutritionAfter(nutrition_before, recipe_object_portion_list);

            return [nutrition_before, nutrition_after];
        } catch (e) {
            throw e;
        }
    }

    /**
     * Get the remaining budget of the user for the day
     * @param decodedHeaders - headers from request
     * @param dateValidationDTO - DTO containing the date validated
     * @returns an Object of remaining nutrients of the user for the day
     */
    async getRemainingBudget(decodedHeaders: any, dateValidationDTO: DateValidationDTO = null){
        if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, 400); }

        const user_id = decodedHeaders['sub'];

        const user_object = await this.userRepository.findOneBy({ user_id: user_id });

        var date = null;
        if (dateValidationDTO == null){
            date = new Date().toISOString().split('T')[0];
        }
        else {
            date = new Date(dateValidationDTO.date.split('T')[0]);
        }
        
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_id})
            .andWhere('date = :meal_date', {meal_date: date})
            .getOne();

        // if (!meal_logging_summary_entry || meal_logging_summary_entry == null) {
        //     var remaining_nutrients = user_object.daily_budget as JSON;
        //     delete remaining_nutrients["water_intake"];

        //     meal_logging_summary_entry = new MealLogSummary();
        //     meal_logging_summary_entry.user = user_object;
        //     meal_logging_summary_entry.date = date;
        //     meal_logging_summary_entry.remaining_nutrients = remaining_nutrients;

        //     try {
        //         await this.mealLogSummaryRepository.save(meal_logging_summary_entry);
        //     } catch (e) {
        //         throw new Error("Error saving meal logging summary entry");
        //     }

        //     return remaining_nutrients;
        // }
        // else {
        //     return meal_logging_summary_entry.remaining_nutrients;
        // }
    }
}