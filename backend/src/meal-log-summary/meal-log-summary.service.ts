import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { In, Repository } from "typeorm";
import { CreateMealLoggingSummaryDTO } from "./dto/create-meal-logging-summary-dto";
import { User } from "src/user/user.entity";
import { MealLogging } from "src/meal-logging/meal-logging.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { CommonService } from "src/common/common.service";
import { UserService } from "src/user/user.service";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";

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
        const meal_logging_summary_date = new Date(createMealLoggingSummaryDTO.mealDate.date.split('T')[0]);

        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('date = :meal_date', {meal_date: meal_logging_summary_date})
            .getOne();

        if (!meal_logging_summary_entry || meal_logging_summary_entry == null) {
            meal_logging_summary_entry = new MealLogSummary();
            meal_logging_summary_entry.user = user_object;
            meal_logging_summary_entry.date = meal_logging_summary_date;
            meal_logging_summary_entry.remaining_nutrients = createMealLoggingSummaryDTO.nutritionAfter;
        }
        else {
            meal_logging_summary_entry.remaining_nutrients = createMealLoggingSummaryDTO.nutritionAfter;
        }

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
     * @param createMealLoggingSummaryDTO - DTO containing the meals that user selected and portion
     * @returns [nutrition_before, nutrition_after], a list of the nutrition before and after logging the meals
     */
    async calculateNutritionSummary(decodedHeaders: any, createMealLoggingSummaryDTO: CreateMealLoggingSummaryDTO){
        try {
            // Validate userId
            if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, 400); }
            var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });

            // combine multiple lists of meal logging ids into one big lists of meal looging ids
            const combined_meals = [
                ...createMealLoggingSummaryDTO.recipeIdsInJSON.Breakfast, 
                ...createMealLoggingSummaryDTO.recipeIdsInJSON.Lunch, 
                ...createMealLoggingSummaryDTO.recipeIdsInJSON.Dinner, 
                ...createMealLoggingSummaryDTO.recipeIdsInJSON.Other
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

            const nutrition_before = await this.getRemainingBudget(decodedHeaders, createMealLoggingSummaryDTO.mealDate);

            const nutrition_after = this.commonService.calculateNutritionAfter(nutrition_before, recipe_object_portion_list);

            return [nutrition_before, nutrition_after];
        } catch (e) {
            throw e;
        }
    }

    async getRemainingBudget(decodedHeaders: any, dateString: DateValidationDTO = null){
        if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, 400); }

        const user_id = decodedHeaders['sub'];

        const user_object = await this.userRepository.findOneBy({ user_id: user_id });

        var date = null;
        if (dateString == null){
            date = new Date().toISOString().split('T')[0];
        }
        else {
            date = new Date(dateString.date.split('T')[0]);
        }
        
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_id})
            .andWhere('date = :meal_date', {meal_date: date})
            .getOne();

        if (!meal_logging_summary_entry || meal_logging_summary_entry == null) {
            var remaining_nutrients = user_object.daily_budget as JSON;
            delete remaining_nutrients["water_intake"];

            meal_logging_summary_entry = new MealLogSummary();
            meal_logging_summary_entry.user = user_object;
            meal_logging_summary_entry.date = date;
            meal_logging_summary_entry.remaining_nutrients = remaining_nutrients;

            try {
                await this.mealLogSummaryRepository.save(meal_logging_summary_entry);
            } catch (e) {
                throw new Error("Error saving meal logging summary entry");
            }

            return remaining_nutrients;
        }
        else {
            return meal_logging_summary_entry.remaining_nutrients;
        }
    }
}