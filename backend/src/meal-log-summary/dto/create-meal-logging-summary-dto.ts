import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsObject, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { RecipeComponentDTO } from "../../recipe-component/dto/recipe-component-dto";
import { MealLogSummary } from "../meal-log-summary.entity";
import { NutritionInfoDTO } from "src/recipe/dto/nutrition-info-dto";

export class MealsDTO {
    @IsArray()
    @IsString({ each: true })
    Breakfast: string[];  

    @IsArray()
    @IsString({ each: true })
    Lunch: string[];
  
    @IsArray()
    @IsString({ each: true })
    Dinner: string[];
  
    @IsArray()
    @IsString({ each: true })
    Other: string[];
}

export class CreateMealLoggingSummaryDTO{
    @IsNotEmpty()
    @IsString()
    @Matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/, 
        {
            message: 'Meal date must be in the format YYYY-MM-DDTHH:MM:SS.SSS.',
        }
    )
    readonly mealDate: string;
    
    @IsObject()
    @ValidateNested()
    @Type(() => MealsDTO)
    readonly foodConsumed: MealsDTO;

}