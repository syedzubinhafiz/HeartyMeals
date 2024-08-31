import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";

export class UpdateMealLoggingDTO{

    @IsNotEmpty()
    @IsDateString()
    readonly newDate: string;

    @IsNotEmpty()
    @IsString()
    readonly mealLoggingId: string;

    @IsNotEmpty()
    @IsNumber()
    readonly portion: Number;

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;


}