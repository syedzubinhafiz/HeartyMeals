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
     *  "Breakfast": ["5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b"],
     *  "Lunch": ["5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b"],
     *  "Dinner": ["5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b"],
     *  "Other": ["5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b"]
     * }
     */
    @ValidateNested()
    @Type(() => MealLoggingsDTO)
    readonly mealLoggingIdsInJSON: MealLoggingsDTO;

    @IsOptional()
    @Transform(({ value }) => (value === undefined ? {} : value))
    readonly nutritionAfter: JSON;

}