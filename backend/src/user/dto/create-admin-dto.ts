import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Gender } from "../enum/gender.enum";

export class CreateAdminDTO{

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly first_name: string;

    @IsString()
    @IsNotEmpty()
    readonly last_name: string;
    
    @IsEnum(Gender)
    @IsNotEmpty()
    readonly gender: Gender;
}