import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsJSON, IsNotEmpty, IsObject, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { RecipeComponentDTO } from "../../recipe-component/dto/recipe-component-dto";
import { MealLogSummary } from "../meal-log-summary.entity";
import { NutritionInfoDTO } from "src/recipe/dto/nutrition-info-dto";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";
import { MealLoggingListDTO } from "src/meal-logging/dto/meal-logging-list-dto";

export class MealsDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MealLoggingListDTO)
    Breakfast: MealLoggingListDTO[];  

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MealLoggingListDTO)
    Lunch: MealLoggingListDTO[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MealLoggingListDTO)
    Dinner: MealLoggingListDTO[];
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MealLoggingListDTO)
    Other: MealLoggingListDTO[];
}

export class CreateMealLoggingSummaryDTO{
    @IsNotEmpty()
    @Type(() => DateValidationDTO)
    readonly mealDate: DateValidationDTO;
    
    /**
     * @example
     * {
     *  "Breakfast": [{recipeId: "5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b", portion: 1}],
     *  "Lunch": [{recipeId: "5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b", portion: 1}],
     *  "Dinner": [{recipeId: "5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b", portion: 1}],
     *  "Other": [{recipeId: "5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b", portion: 1}]
     * }
     */
    @ValidateNested()
    @Type(() => MealsDTO)
    readonly recipeIdsInJSON: MealsDTO;

    @IsOptional()
    @ValidateNested()
    @Transform(({ value }) => (value === undefined ? {} : value))
    readonly nutritionAfter: JSON;

}