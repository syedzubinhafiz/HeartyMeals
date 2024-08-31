import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, Min, Matches, IsDateString} from "class-validator";


export class UpdateFluidLoggingDTO{
    
    @IsDateString()
    @IsNotEmpty()
    readonly loggingDate: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly waterIntake: number;    
}