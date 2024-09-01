import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";

export class UpdateMealLoggingDTO{

    @IsNotEmpty()
    @IsDateString()
    readonly newDate: string;

    @IsNotEmpty()
    @IsString()
    readonly mealLoggingSummaryId: string;

    @IsNotEmpty()
    @IsString()
    readonly mealLoggingId: string;

    @IsNotEmpty()
    @IsNumber()
    readonly portion: number;

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;


}