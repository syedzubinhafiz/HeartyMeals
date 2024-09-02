import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-logging/enum/meal-type.enum";

export class UpdateMealLoggingSummaryDTO{

    @IsNotEmpty()
    @IsDateString()
    newDate: string;

    @IsNotEmpty()
    @IsString()
    mealLoggingSummaryId: string;

    @IsNotEmpty()
    @IsString()
    mealLoggingId: string;

    @IsNotEmpty()
    @IsNumber()
    portion: number;

    @IsNotEmpty()
    @IsEnum(MealType)
    oldMealType: MealType;

    @IsNotEmpty()
    @IsEnum(MealType)
    newMealType: MealType;

}
