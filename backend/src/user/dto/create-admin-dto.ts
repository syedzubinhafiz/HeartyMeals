import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Gender } from "../enum/gender.enum";

export class CreateAdminDTO{

    @IsEnum(Gender)
    @IsNotEmpty()
    readonly gender: Gender;

    @IsString()
    @IsNotEmpty()
    readonly ethnicityId: string;
}