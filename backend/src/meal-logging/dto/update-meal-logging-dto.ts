import { Transform } from "class-transformer";
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
     * Optional: new meal date if user wants to change the meal date (meal planning). If not provided, it will be passed in as null
     * 
     * @example "2024-09-27"
     */
    @IsOptional()
    @IsDateString()
    readonly newMealDate: string = null;

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