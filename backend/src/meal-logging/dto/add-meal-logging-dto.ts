import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";
import { MealLoggingListDTO } from "./meal-logging-list-dto";

export class AddMealLoggingDTO{

    @IsNotEmpty()
    @IsDateString()
    readonly mealDate: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MealLoggingListDTO)
    readonly recipeIds: MealLoggingListDTO[];

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;
}