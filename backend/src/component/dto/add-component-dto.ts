import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { ComponentType } from "../enum/type.enum";
import { Type } from "class-transformer";
import { MeasuringUnit } from "../enum/measuring-unit.enum";
import { NutritionInfoDTO } from "src/recipe/dto/nutrition-info-dto";

export class AddComponentDTO {

    @IsString()
    readonly name: string;

    @IsEnum(ComponentType)
    @IsNotEmpty()
    readonly componentType: ComponentType;

    @IsEnum(MeasuringUnit)
    @IsNotEmpty()
    readonly unit: MeasuringUnit;

    @IsNumber()
    readonly amount: number;

    @IsString()
    @IsNotEmpty()
    readonly foodCategoryId: string;
    
    @ValidateNested()
    @Type(()=> NutritionInfoDTO)
    readonly nutritionInformation: NutritionInfoDTO;
}