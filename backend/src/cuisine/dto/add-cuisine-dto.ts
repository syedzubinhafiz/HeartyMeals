import { IsNotEmpty, IsString } from "class-validator";

export class AddCuisineDTO{

    /**
     * @example "American"
     */
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    /**
     * @example "USA"
     */
    @IsNotEmpty()
    @IsString()
    readonly countryId: string;
}