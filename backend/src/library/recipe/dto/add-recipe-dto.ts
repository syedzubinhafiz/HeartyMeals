import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RecipeDTO } from "./recipe-dto";
import { RecipeComponentDTO } from "../recipe-component/dto/recipe-component-dto";

export class AddRecipeDTO{

    @IsNotEmpty()       
    @IsString()
    readonly userId: string;

    @IsNotEmpty()
    @Type(()=> RecipeDTO)
    readonly recipe: RecipeDTO;

    @ArrayNotEmpty()
    @ValidateNested({each: true})
    @Type(()=>RecipeComponentDTO)
    readonly components: RecipeComponentDTO[];

}