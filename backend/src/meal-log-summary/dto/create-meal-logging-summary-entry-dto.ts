import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class MealLoggingsDTO {
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
    @Type(() => MealLoggingsDTO)
    readonly mealLoggingIdsInJSON: MealLoggingsDTO;

    @IsOptional()
    @ValidateNested()
    @Transform(({ value }) => (value === undefined ? {} : value))
    readonly nutritionAfter: JSON;

}