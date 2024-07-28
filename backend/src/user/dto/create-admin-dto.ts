import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatAdminDTO{

    @IsString()
    readonly gshUserId: string;

    @IsString()
    readonly name: string;

    @IsEmail()
    readonly email: string;

}