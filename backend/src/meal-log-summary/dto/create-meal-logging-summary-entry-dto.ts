import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { MealType } from "src/meal-logging/enum/meal-type.enum";

export class AddMealLoggingSummaryDTO{
    
    @IsNotEmpty()
    @IsDateString()
    readonly mealDate: string;
    
    /**
     * @example
     * {
     *  mealLoggingIds: ["5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b"],
     * }
     */
    @IsArray()
    @IsString({ each: true })
    readonly mealLoggingIds: string[];

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;

    @IsOptional()
    @Transform(({ value }) => (value === undefined ? {} : value))
    readonly nutritionAfter: JSON;

}