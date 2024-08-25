import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";

export class UpdateMealLoggingDTO{

    @IsNotEmpty()
    @IsString()
    readonly newDate: string;

    @IsNotEmpty()
    @IsString()
    readonly mealLoggingId: string;

    @IsNotEmpty()
    @IsString()
    readonly recipeId: string;

    @IsNotEmpty()
    @IsNumber()
    readonly portion: Number;

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;


}