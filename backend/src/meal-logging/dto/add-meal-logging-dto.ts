import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";
import { MealLoggingListDTO } from "./meal-logging-list-dto";

export class AddMealLoggingDTO{

    @IsNotEmpty()
    @IsDateString()
    mealDate: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MealLoggingListDTO)
    recipeIds: MealLoggingListDTO[];

    @IsNotEmpty()
    @IsEnum(MealType)
    mealType: MealType;
}