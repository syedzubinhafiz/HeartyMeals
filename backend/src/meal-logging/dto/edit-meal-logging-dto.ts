import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";
import { MealLoggingListDTO } from "./meal-logging-list-dto";

export class EditMealLoggingDTO{

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