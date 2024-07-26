import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { NutritionInfoDTO } from "./nutrition-info-dto";
import { Type } from "class-transformer";
import { RecommendedMealTimeDTO } from "./reommended-meal-time-dto";
import { Visibility } from "../visibility.enum";

export class RecipeDTO{

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString({each: true})
    readonly instruction: string[];

    @IsNotEmpty()
    @IsNumber()
    readonly servingSize: number;

    @IsOptional()
    @ValidateNested()
    @Type(()=> NutritionInfoDTO)
    readonly nutritionInformation?: NutritionInfoDTO = new NutritionInfoDTO();

    @IsNotEmpty()
    @ValidateNested()
    @Type(()=> RecommendedMealTimeDTO)
    readonly mealTimeRecommendation: RecommendedMealTimeDTO;
    
    @IsOptional()
    @IsEnum(Visibility)
    @Type(()=> String)
    readonly visibility: Visibility;

    @IsNotEmpty()
    @IsString()
    readonly cuisineId: string;

    @IsNotEmpty()
    @IsString()
    readonly dietaryId: string;
}