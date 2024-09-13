import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { MeasuringUnit } from "../../component/enum/measuring-unit.enum";
import { Type } from "class-transformer";

export class RecipeComponentDTO{

    @IsNotEmpty()
    @IsString()
    readonly componentId: string;

    @IsNumber()
    readonly amount: number;

    @IsEnum(MeasuringUnit)
    @Type(()=>String)
    readonly unit: MeasuringUnit;
}