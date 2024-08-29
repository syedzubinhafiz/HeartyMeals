import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { CholesterolLevel } from "../enum/cholesterol.enum";

export class NutritionSettingDTO {
    @IsNumber()
    @IsNotEmpty()
    readonly carbsPercentage: number;

    @IsNumber()
    @IsNotEmpty()
    readonly proteinPercentage: number;

    @IsNumber()
    @IsNotEmpty()
    readonly fatPercentage: number;

    @IsNumber()
    @IsNotEmpty()
    readonly activityLevel: number;

    @IsEnum(CholesterolLevel)
    @IsNotEmpty()
    readonly cholesterolLevel: CholesterolLevel;
}