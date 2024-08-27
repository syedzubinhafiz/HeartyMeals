import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { In, Repository } from "typeorm";
import { CreateMealLoggingSummaryDTO } from "./dto/create-meal-logging-summary-dto";
import { User } from "src/user/user.entity";
import { MealLogging } from "src/meal-logging/meal-logging.entity";
import { Recipe } from "src/recipe/recipe.entity";

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
    ){}

    async createMealLoggingSummary(decodedHeaders: any, createMealLoggingSummaryDTO: CreateMealLoggingSummaryDTO){
        // Validate userId
        var user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });
        if (!user_object) { throw new Error("User not found."); }

        const mealLoggingSummaryDate = new Date(createMealLoggingSummaryDTO.mealDate);

        const breakfast = createMealLoggingSummaryDTO.foodConsumed.Breakfast;
        const lunch = createMealLoggingSummaryDTO.foodConsumed.Lunch;
        const dinner = createMealLoggingSummaryDTO.foodConsumed.Dinner;
        const other = createMealLoggingSummaryDTO.foodConsumed.Other;

        const combined_meals = [...breakfast, ...lunch, ...dinner, ...other];

        // get all the meal logging objects
        const meal_logging_entries = await this.mealLoggingRepository.find({
            where: {
                id: In(combined_meals)
            }
        });

        // get all the recipe ids
        const recipe_ids = meal_logging_entries.map(meal_logging => {meal_logging.recipe}); // put portion here
        // const recipe_ids = meal_logging_entries.map(meal_logging => {meal_logging.recipe, meal_logging.portion});

        // get all the recipe objects
        const recipe_entries = await this.recipeRepository.find({
            where: {
                id: In(recipe_ids)
            }
        });

        // get all nutrition info
        const recipe_nutrition = recipe_entries.map(recipe => {recipe.id, recipe.nutrition_info}); 

        // get the user remaining budget 
        // for each recipe id, get the nutrition info, and multiply by the portion then subtract from the user budget
    }
}