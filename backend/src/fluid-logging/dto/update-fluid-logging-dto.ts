import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, Min, Matches, IsDateString} from "class-validator";
import { MeasuringUnit } from "src/component/enum/measuring-unit.enum";


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

    @IsEnum(MeasuringUnit)
    @IsNotEmpty()
    readonly measuringUnit: MeasuringUnit;   
}