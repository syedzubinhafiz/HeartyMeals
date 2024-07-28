import { IsNotEmpty, IsNumber, IsString, IsEmail} from "class-validator";

export class CreatUserDTO{

    @IsString()
    readonly gshUserId: string;
    
    @IsString()
    readonly countryId: string;    

    @IsNotEmpty()
    @IsNumber()
    readonly nyhaLevel: number;

    @IsString()
    readonly dietaryId: string;

    @IsString()
    readonly name: string;

    @IsEmail()
    readonly email: string;
}