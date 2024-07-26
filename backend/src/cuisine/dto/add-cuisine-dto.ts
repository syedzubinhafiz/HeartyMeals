import { IsNotEmpty, IsString } from "class-validator";

export class AddCuisineDTO{

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly countryId: string;
}