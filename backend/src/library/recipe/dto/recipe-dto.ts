import { IsEnum, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
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

    @IsJSON()
    readonly instruction: JSON;

    @IsNumber()
    readonly serving_size: number;

    @ValidateIf(o=> o.user_id !== null)
    @IsOptional()
    @ValidateNested()
    @Type(()=> NutritionInfoDTO)
    readonly nutrition_info?: NutritionInfoDTO = new NutritionInfoDTO();

    @IsNotEmpty()
    @ValidateNested()
    @Type(()=> RecommendedMealTimeDTO)
    readonly recommended_meal_time: RecommendedMealTimeDTO;
    
    @IsOptional()
    @IsEnum(Visibility)
    @Type(()=> String)
    readonly visibility: Visibility;

    @IsNotEmpty()
    @IsString()
    readonly cuisine_id: string;

    @IsNotEmpty()
    @IsString()
    readonly dietary_id: string;
}