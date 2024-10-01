import { Type } from "class-transformer";
import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Visibility } from "src/recipe/enum/visibility.enum";

export class EducationalContentDTO{

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly summary: string;

    @IsEnum(Visibility)
    @IsNotEmpty()
    readonly visibility: Visibility;

    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    readonly content: string[];
}