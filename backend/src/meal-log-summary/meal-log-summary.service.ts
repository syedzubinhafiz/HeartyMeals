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

        const meal_logging_summary_date = new Date(createMealLoggingSummaryDTO.mealDate);

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

    async calculateNutritionSummary(decodedHeaders: any, createMealLoggingSummaryDTO: CreateMealLoggingSummaryDTO){
        // Validate userId
        if (!await this.userService.verifyUser(decodedHeaders)) { throw new Error(`User with id ${decodedHeaders['sub']} not found`); }
        var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });

        const meal_logging_summary_date = new Date(createMealLoggingSummaryDTO.mealDate);

        // combine multiple lists of meal logging ids into one big lists of meal looging ids
        const combined_meals = [
            ...createMealLoggingSummaryDTO.foodConsumed.Breakfast, 
            ...createMealLoggingSummaryDTO.foodConsumed.Lunch, 
            ...createMealLoggingSummaryDTO.foodConsumed.Dinner, 
            ...createMealLoggingSummaryDTO.foodConsumed.Other
        ];

        // get all the meal logging objects
        const meal_logging_entries = await this.mealLoggingRepository.find({
            where: {
                id: In(combined_meals)
            }
        });

        // get all the recipe ids
        const recipe_ids = meal_logging_entries.map(meal_logging => {meal_logging.recipe}); 
        // TODO: put portion here
        // const recipe_ids = meal_logging_entries.map(meal_logging => {meal_logging.recipe, meal_logging.portion});

        // get all the recipe objects
        const recipe_entries = await this.recipeRepository.find({
            where: {
                id: In(recipe_ids)
            }
        });

        // check if all the recipes are found
        if (recipe_ids.length != recipe_entries.length) { throw new Error("Some recipes not found."); }

        // get all nutrition info
        const recipe_nutrition = recipe_entries.map(recipe => {recipe.id, recipe.nutrition_info}); 

        // TODO: calculate the nutrition here
        // const nutrition_before = this.commonService.getRemainingBudget(user_object.user_id, meal_logging_summary_date);

        // const nutrition_after = this.commonService.calculateNutritionAfter(nutrition_before, recipe_nutrition, meal_logging_entries);

        // return [nutrition_before, nutrition_after];
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