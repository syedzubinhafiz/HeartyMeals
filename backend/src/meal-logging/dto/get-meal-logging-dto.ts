import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";

export class GetMealLoggingDTO{

    /**
     * @example "2024-09-22"
     */
    @IsNotEmpty()
    @IsDateString()
    readonly startDate: string;

    /**
     * Optional: new meal date if user wants to change the meal date (meal planning)
     */
    @IsOptional()
    @IsDateString()
    readonly endDate: string;

    /**
     * @example "Asia/Kuala_Lumpur"
     */
    @IsNotEmpty()
    @IsString()
    readonly timeZone: string;
}