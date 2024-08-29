import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";

export class UpdateMealLoggingDTO{

    @IsNotEmpty()
    @IsString()
    @Matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{4}$/, 
        {
            message: 'newDate must be in the format YYYY-MM-DDTHH:MM:SS.SSS',
        }
    )
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