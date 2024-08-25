import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";
import { MealLoggingListDTO } from "./meal-logging-list-dto";

export class AddMealLoggingDTO{

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MealLoggingListDTO)
    readonly recipeIds: MealLoggingListDTO[];

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;
}