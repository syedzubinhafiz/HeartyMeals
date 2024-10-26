import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, Min, Matches, IsDateString} from "class-validator";
import { FluidUnit } from "../enum/fluid-unit-enum";


export class UpdateFluidLoggingDTO{
    
    /**
     * @example 2024-10-26:12:00
     */
    @IsNotEmpty()
    @IsDateString()
    readonly loggingDateTime: string;

    /**
     * @example "Asia/Kuala_Lumpur"
     */
    @IsNotEmpty()
    @IsString()
    readonly timeZone: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly waterIntake: number;    

    /**
     * @example "ml"
     */
    @IsEnum(FluidUnit)
    @IsNotEmpty()
    readonly fluidUnit: FluidUnit;   
}