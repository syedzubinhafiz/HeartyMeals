import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FileUploadDTO } from "src/storage/dto/file-upload-dto";
import { ComponentDTO } from "./component-dto";

export class AddComponentDTO {

    @IsNotEmpty()
    @ValidateNested()
    @Type(()=> ComponentDTO)
    readonly component: ComponentDTO;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => FileUploadDTO)
    readonly files: FileUploadDTO;
}