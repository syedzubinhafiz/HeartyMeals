import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { CholesterolLevel } from "../enum/cholesterol.enum";

export class NutritionSettingDTO {
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(1)
    readonly carbsPercentage: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(1)
    readonly proteinPercentage: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(1)
    readonly fatPercentage: number;

    @IsEnum(CholesterolLevel)
    @IsNotEmpty()
    readonly cholesterolLevel: CholesterolLevel;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    readonly activityLevel: number;
}