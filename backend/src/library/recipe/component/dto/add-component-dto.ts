import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { ComponentType } from "../type.enum";
import { Type } from "class-transformer";
import { NutritionInfoDTO } from "../../dto/nutrition-info-dto";
import { MeasuringUnit } from "../measuring-unit.enum";

export class AddComponentDTO {

    @IsString()
    readonly name: string;

    @IsEnum(ComponentType)
    @Type(()=> String)
    readonly componentType: ComponentType;

    @IsEnum(MeasuringUnit)
    @Type(()=> String)
    readonly units: MeasuringUnit;

    @IsNumber()
    readonly amount: number;

    @IsString()
    readonly cuisineId: string;
    
    @ValidateNested()
    @Type(()=> NutritionInfoDTO)
    readonly nutritionInformation: NutritionInfoDTO;
}