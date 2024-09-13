import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RecipeDTO } from "./recipe-dto";
import { RecipeComponentDTO } from "../../recipe-component/dto/recipe-component-dto";
import { FileUploadDTO } from "src/storage/dto/file-upload-dto";

export class AddRecipeDTO{

    @IsNotEmpty()
    @Type(()=> RecipeDTO)
    readonly recipe: RecipeDTO;

    @ArrayNotEmpty()
    @ValidateNested({each: true})
    @Type(()=>RecipeComponentDTO)
    readonly components: RecipeComponentDTO[];

    @IsOptional()
    @Type(() => FileUploadDTO)
    files?: FileUploadDTO;

}