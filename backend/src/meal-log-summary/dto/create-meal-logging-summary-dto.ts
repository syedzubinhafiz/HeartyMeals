import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsObject, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { RecipeComponentDTO } from "../../recipe-component/dto/recipe-component-dto";
import { MealLogSummary } from "../meal-log-summary.entity";
import { NutritionInfoDTO } from "src/recipe/dto/nutrition-info-dto";

export class CreateMealLoggingSummaryDTO{

    @IsNotEmpty()
    @IsString()
    @Matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/, 
        {
            message: 'newDate must be in the format YYYY-MM-DDTHH:MM:SS.SSS',
        }
    )
    readonly mealDate: string;

    @IsOptional()
    @ValidateNested()
    @Type(()=> NutritionInfoDTO)
    readonly remaining_nutrients: NutritionInfoDTO;
    
    @IsObject()
    @ValidateNested()
    @Type(() => MealsDTO)
    readonly food_consumed: MealsDTO;

}
  
export class MealsDTO {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    Breakfast: string[];  

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    Lunch: string[];
  
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    Dinner: string[];
  
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    Other: string[];
  
}
