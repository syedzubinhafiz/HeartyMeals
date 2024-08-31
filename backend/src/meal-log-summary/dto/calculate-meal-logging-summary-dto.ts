import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDateString, IsJSON, IsNotEmpty, IsObject, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealLoggingListDTO } from "src/meal-logging/dto/meal-logging-list-dto";

export class MealRecipesDTO {
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

export class CalculateMealLoggingSummaryDTO{
    @IsNotEmpty()
    @IsDateString()
    readonly mealDate: string;
    
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
    @Type(() => MealRecipesDTO)
    readonly recipeIdsInJSON: MealRecipesDTO;
}