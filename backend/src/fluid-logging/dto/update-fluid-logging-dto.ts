import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, Min, Matches, IsDateString} from "class-validator";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";


export class UpdateFluidLoggingDTO{
    
    @IsNotEmpty()
    @IsDateString()
    readonly loggingDate: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly waterIntake: number;    
}