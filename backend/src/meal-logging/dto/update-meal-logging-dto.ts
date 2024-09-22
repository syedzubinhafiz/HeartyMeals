import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { MealType } from "src/meal-type.enum";

export class UpdateMealLoggingDTO{

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
    readonly systemDate: string;

    /**
     * @example "Asia/Kuala_Lumpur"
     */
    @IsNotEmpty()
    @IsString()
    readonly timeZone: string;

    @IsNotEmpty()
    @IsString()
    readonly mealLoggingId: string;

    @IsNotEmpty()
    @IsNumber()
    readonly portion: number;

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;


}