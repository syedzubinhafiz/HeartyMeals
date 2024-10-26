import { Type } from "class-transformer";
import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Visibility } from "src/recipe/enum/visibility.enum";

export class EducationalContentDTO{

    /**
     * @example "How to make a cake"
     */
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    /**
     * @example "This is a summary of how to make a cake"
     */
    @IsNotEmpty()
    @IsString()
    readonly summary: string;

    /**
     * @example "Public"
     */
    @IsEnum(Visibility)
    @IsNotEmpty()
    readonly visibility: Visibility;

    /**
     * @example ["Step 1: Prepare the ingredients", "Step 2: Mix the ingredients", "Step 3: Bake the cake"]
     */
    @ArrayNotEmpty()
    @IsString({ each: true })
    readonly content: string[];
}