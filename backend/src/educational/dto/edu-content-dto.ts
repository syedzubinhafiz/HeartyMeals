import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class EducationalContentDTO{

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly summary: string;

    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    readonly content: Array<JSON>;
}