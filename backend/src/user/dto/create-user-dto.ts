import { IsNotEmpty, IsNumber, IsString, IsEmail, IsEnum} from "class-validator";
import { Gender } from "../enum/gender.enum";

export class CreatUserDTO{

    
    @IsString()
    readonly countryId: string;    

    @IsNotEmpty()
    @IsNumber()
    readonly nyhaLevel: number;

    @IsString()
    readonly dietaryId: string;

    @IsEnum(Gender)
    @IsNotEmpty()
    readonly gender: Gender;
}