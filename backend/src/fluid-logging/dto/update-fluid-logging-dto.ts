import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, Min, Matches, IsDateString} from "class-validator";
import { FluidUnit } from "../enum/fluid-unit-enum";


export class UpdateFluidLoggingDTO{
    
    @IsNotEmpty()
    @IsDateString()
    readonly loggingDateTime: string;

    @IsNotEmpty()
    @IsString()
    readonly timeZone: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly waterIntake: number;    

    @IsEnum(FluidUnit)
    @IsNotEmpty()
    readonly fluidUnit: FluidUnit;   
}