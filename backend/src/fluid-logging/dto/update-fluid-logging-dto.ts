import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, Min, Matches, IsDateString} from "class-validator";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";


export class UpdateFluidLoggingDTO{
    
    @IsNotEmpty()
    @Type(()=> DateValidationDTO)
    readonly loggingDate: DateValidationDTO;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly waterIntake: number;    
}