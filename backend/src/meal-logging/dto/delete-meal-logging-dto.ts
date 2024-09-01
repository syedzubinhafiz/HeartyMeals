import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";

export class DeleteMealLoggingDTO{

    @IsNotEmpty()
    @IsDateString()
    readonly mealDate: string;

    @IsString()
    @IsNotEmpty()
    readonly mealLoggingId: string;

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;
}