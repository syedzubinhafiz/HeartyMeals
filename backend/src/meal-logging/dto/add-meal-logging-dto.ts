import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";
import { MealLoggingListDTO } from "./meal-logging-list-dto";

export class AddMealLoggingDTO{

    @IsNotEmpty()
    @IsString()
    @Matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}$/, 
        {
            message: 'newDate must be in the format YYYY-MM-DDTHH:MM:SS.SSS',
        }
    )
    readonly mealDate: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MealLoggingListDTO)
    readonly recipeIds: MealLoggingListDTO[];

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;
}