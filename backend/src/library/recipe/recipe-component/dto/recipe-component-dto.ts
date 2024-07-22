import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { MeasuringUnit } from "../../component/measuring-unit.enum";
import { Type } from "class-transformer";

export class RecipeComponentDTO{

    @IsNotEmpty()
    @IsString()
    readonly component_id: string;

    @IsNumber()
    readonly amount: number;

    @IsEnum(MeasuringUnit)
    @Type(()=>String)
    readonly units: MeasuringUnit;
}