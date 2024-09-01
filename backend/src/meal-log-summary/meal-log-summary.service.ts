import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { EntityManager, In, Repository } from "typeorm";
import { CalculateMealLoggingSummaryDTO } from "./dto/calculate-meal-logging-summary-dto";
import { User } from "src/user/user.entity";
import { MealLogging } from "src/meal-logging/meal-logging.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { CommonService } from "src/common/common.service";
import { UserService } from "src/user/user.service";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";
import { AddMealLoggingSummaryDTO } from "./dto/add-meal-logging-summary-dto";
import { RemomveMealLoggingIdDTO } from "./dto/remove-meal-logging-id-dto";

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

    /**
     * Adds the meal logging ids created to the meal logging summary
     * @param decodedHeaders - headers from request
     * @param addMealLoggingSummaryDTO - DTO containing the meal logging ids and nutrition info
     * @returns true if the meal logging summary is added successfully
     */
    async addMealLoggingSummary(decodedHeaders: any, addMealLoggingSummaryDTO: AddMealLoggingSummaryDTO, transactionalEntityManager: EntityManager){

        const user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });

        // get the date only
        const meal_logging_summary_date = new Date(addMealLoggingSummaryDTO.mealDate.split('T')[0]);

        // get the entry
        // the entry will always exist because user will always call to get the remaining budget before logging the meal which will get the entry
        // or user will call to get daily budget which will get the entry also
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('date = :meal_date', {meal_date: meal_logging_summary_date})
            .getOne();
        
        // add the new meal logging ids into the specified meal type in the meal logging summary 
        addMealLoggingSummaryDTO.mealLoggingIds.forEach((item) => {
            meal_logging_summary_entry.food_consumed[addMealLoggingSummaryDTO.mealType].push(item);
        });

        meal_logging_summary_entry.remaining_nutrients = addMealLoggingSummaryDTO.nutritionAfter;

        try {
            await transactionalEntityManager.save(meal_logging_summary_entry);
            return true;
        }
        catch (e) {
            throw new HttpException(e, 400);
        }

    }

    /**
     * Calculate the nutrition info before logging the meal and after logging the meal
     * @param decodedHeaders - headers from request
     * @param calculateMealLoggingSummaryDTO - DTO containing the meals that user selected and portion
     * @returns [daily_budget, nutrition_before, nutrition_after]
     */
    async calculateNutritionSummary(decodedHeaders: any, calculateMealLoggingSummaryDTO: CalculateMealLoggingSummaryDTO){
        try {
            // Validate userId
            if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, 400); }

         
            // get recipe ids
            const recipe_ids = calculateMealLoggingSummaryDTO.recipeIdPortions.map(recipe_id_portion => recipe_id_portion.recipeId);

            // get recipe objects
            const recipes = await this.recipeRepository.find({
                where: {
                    id: In(recipe_ids)
                }
            });

            const recipe_nutrition_portion = [];

            // combine the recipe id, nutrition info and portion into one list
            calculateMealLoggingSummaryDTO.recipeIdPortions.forEach(recipe_id_portion => {
                const recipe = recipes.find(r => r.id === recipe_id_portion.recipeId);
                if (recipe) {
                    recipe_nutrition_portion.push({
                        recipe_id: recipe_id_portion.recipeId,
                        nutrition_info: recipe.nutrition_info, 
                        recipe_portion: recipe.serving_size,
                        meal_logging_portion: recipe_id_portion.portion 
                    });
                }
                else {
                    throw new HttpException (`Recipe with id ${recipe_id_portion.recipeId} not found.`, 404);
                }
            });

            // get the remaining budget of the user for the day    
            const  dateValidationDTO = new DateValidationDTO();
            dateValidationDTO.date = calculateMealLoggingSummaryDTO.mealDate;

            // nutrition_list = [daily_budget, nutrition_before]
            // const nutrition_list = await this.getRemainingBudget(decodedHeaders, dateValidationDTO);

            // calculate the nutrition if the user plan to eat the meal
            // const nutrition_after = this.commonService.calculateNutritionAfter(nutrition_list[1], recipe_nutrition_portion);

            // return [nutrition_list[0], nutrition_list[1], nutrition_after];
        } catch (e) {
            throw e;
        }
    }

    /**
     * Remove the meal logging id from the meal logging summary, and add the nutrition back to the remaining nutrients.
     * This is called when the user deletes a meal logging from meal logging module.
     * @param decodedHeaders - headers from request
     * @param remomveMealLoggingIdDTO - DTO containing the meal logging id to be removed
     * @returns true if the meal logging id is removed successfully
     */
    async removeMealLoggingId(decodedHeaders: any, remomveMealLoggingIdDTO: RemomveMealLoggingIdDTO, transactionalEntityManager: EntityManager){
        // remove the meal logging id from the meal logging summary
        // Validate userId
        if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, 400); }

        const user_id = decodedHeaders['sub'];
        const date = new Date(remomveMealLoggingIdDTO.date.split('T')[0]);

        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_id})
            .andWhere('date = :meal_date', {meal_date: date})
            .getOne();

        // get meal logging object with recipe object
        const meal_logging_object = await this.mealLoggingRepository.findOne({
            where: { id: remomveMealLoggingIdDTO.mealLoggingId },
            relations: ['recipe'],
        });

        if (!meal_logging_object || meal_logging_object == null) { return new HttpException(`Meal logging with id ${remomveMealLoggingIdDTO.mealLoggingId} not found.`, 404); }

        // remove the meal logging id from the food consumed
        meal_logging_summary_entry.food_consumed[remomveMealLoggingIdDTO.mealType] = meal_logging_summary_entry.food_consumed[remomveMealLoggingIdDTO.mealType].filter(meal_logging_id => meal_logging_id !== remomveMealLoggingIdDTO.mealLoggingId);

        // add the nutrition to the remaining nutrients
        // meal_logging_summary_entry.remaining_nutrients["calories"] += meal_logging_object.recipe.nutrition_info["calories"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        // meal_logging_summary_entry.remaining_nutrients["carbs"] += meal_logging_object.recipe.nutrition_info["totalCarbohydrate"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        // meal_logging_summary_entry.remaining_nutrients["protein"] += meal_logging_object.recipe.nutrition_info["protein"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        // meal_logging_summary_entry.remaining_nutrients["fats"] += meal_logging_object.recipe.nutrition_info["fat"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        // meal_logging_summary_entry.remaining_nutrients["sodium"] += meal_logging_object.recipe.nutrition_info["sodium"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        // meal_logging_summary_entry.remaining_nutrients["cholesterol"] += meal_logging_object.recipe.nutrition_info["cholesterol"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);

        try {
            return (await transactionalEntityManager.save(meal_logging_summary_entry)).id;
        } catch (e) {
            throw new HttpException(e, 400);
        }
        
    }

    /**
     * Update the nutrition budget 
     * @param decodedHeaders - headers from request
     * @param mealLoggingSummaryId - meal logging summary id
     * @returns [daily_budget, nutrition_before, nutrition_after]
     */
    async updateNutritionBudget(decodedHeaders: any, mealLoggingSummaryId: string ){
        try {     

            var meal_logging_summary_entry = await this.mealLogSummaryRepository.findOneBy({ id: mealLoggingSummaryId });

            const combined_meal_logging_ids = meal_logging_summary_entry.food_consumed["Breakfast"].concat(meal_logging_summary_entry.food_consumed["Lunch"], meal_logging_summary_entry.food_consumed["Dinner"], meal_logging_summary_entry.food_consumed["Other"]);

            // get all the recipe objects
            const meal_logging_objects = await this.mealLoggingRepository.find({
                where: {
                    id: In(combined_meal_logging_ids)
                },
                relations: ['recipe']
            });

            // get the recipe id and recipe nutrition info 
            const recipe_nutrition_portion = meal_logging_objects.map(meal_logging_object => {
                return {
                    recipe_id: meal_logging_object.recipe.id,
                    nutrition_info: meal_logging_object.recipe.nutrition_info,
                    recipe_portion: meal_logging_object.recipe.serving_size,
                    // meal_logging_portion: meal_logging_object.portion
                }
            });

            const dateValidationDTO = new DateValidationDTO();
            dateValidationDTO.date = meal_logging_summary_entry.date.toISOString();
            // nutrition_list = [daily_budget, nutrition_before]
            // const nutrition_list = await this.getRemainingBudget(decodedHeaders, dateValidationDTO);

            // calculate the nutrition if the user plan to eat the meal
            // const nutrition_after = this.commonService.calculateNutritionAfter(nutrition_list[1], recipe_nutrition_portion);

            // return [nutrition_list[0], nutrition_list[1], nutrition_after];
        } catch (e) {
            throw e;
        }
    }
}