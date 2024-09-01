import { IsNotEmpty, IsDateString} from "class-validator";


export class DateValidationDTO{
    
    @IsDateString()
    @IsNotEmpty()
    date: string;

}