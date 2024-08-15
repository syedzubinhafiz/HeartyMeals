import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateUserAllergyDTO{

    @IsString()
    @IsNotEmpty()
    readonly userId: string;

    @IsString()
    @IsNotEmpty()
    readonly foodCatId: string;
}