import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RecipePortionDTO } from "src/meal-logging/dto/recipe-portion-dto";
import { MealType } from "src/meal-logging/enum/meal-type.enum";

export class AddMealLoggingSummaryDTO{
    
    @IsNotEmpty()
    @IsDateString()
    mealDate: string;
    
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

    /**
     * @example
     * {
     *  mealLoggingIds: ["5f9d7b4b-1b3b-4b3b-8b3b-3b3b3b3b3b3b"]
     * }
     */
    @IsOptional()
    @Transform(({ value }) => (value === undefined ? {} : value))
    mealLoggingIds: string[];


    @IsNotEmpty()
    @IsEnum(MealType)
    mealType: MealType;

    @IsOptional()
    @Transform(({ value }) => (value === undefined ? {} : value))
    nutritionAfter: JSON;

}