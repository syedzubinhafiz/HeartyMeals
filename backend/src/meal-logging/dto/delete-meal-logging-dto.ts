import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";

export class DeleteMealLoggingDTO{

    /**
     * @example "2024-09-22"
     */
    @IsNotEmpty()
    @IsDateString()
    readonly mealDate: string;

    /**
     * @example "2024-09-22"
     */
    @IsNotEmpty()
    @IsDateString()
    readonly userLocalDate: string;

    /**
     * @example "Asia/Kuala_Lumpur"
     */
    @IsNotEmpty()
    @IsString()
    readonly timeZone: string;

    @IsString()
    @IsNotEmpty()
    readonly mealLoggingId: string;

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;
}