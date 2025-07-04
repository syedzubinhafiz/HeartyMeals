import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RecipePortionDTO } from "src/meal-logging/dto/recipe-portion-dto";
import { MealType } from "src/meal-logging/enum/meal-type.enum";

export class AddMealLoggingSummaryDTO{
    
    /**
     * @example "2024-09-22"
     */
    @IsNotEmpty()
    @IsDateString()
    readonly mealDate: string;

    /**
     * @example "2024-09-22T08:11:22:33"
     */
    @IsNotEmpty()
    @IsDateString()
    readonly userLocalDateTime: string;

    /**
     * @example "Asia/Kuala_Lumpur"
     */
    @IsNotEmpty()
    @IsString()
    readonly timeZone: string;

    @IsBoolean()
    @IsNotEmpty()
    readonly isMealPlanning: boolean = false;

    /**
     * @example
     * {
     *  mealList: [{recipeId: "5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b", portion: 1}]
     * }
     */
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecipePortionDTO)
    readonly recipeIdPortions: RecipePortionDTO[];

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType;
}