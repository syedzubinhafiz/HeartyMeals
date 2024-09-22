import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, Min, Matches, IsDateString} from "class-validator";


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
}