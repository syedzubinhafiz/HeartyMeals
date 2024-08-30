import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, Min, Matches} from "class-validator";


export class UpdateFluidLoggingDTO{
    
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}$/, {message: "Timestamp must be in the format YYYY-MM-DDTHH:MM:SS.SSS+-HHMM"}
    )
    readonly loggingDate: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    readonly waterIntake: number;    
}