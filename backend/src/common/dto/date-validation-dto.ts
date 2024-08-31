import { IsNotEmpty, IsDateString} from "class-validator";


export class DateValidationDTO{
    
    @IsDateString()
    @IsNotEmpty()
    readonly date: string;

}