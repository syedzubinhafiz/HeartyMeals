import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class EducationalContentDTO{

    @IsNotEmpty()
    @IsString()
    readonly userId: string;

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

}