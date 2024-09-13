import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FileUploadDTO } from "src/storage/dto/file-upload-dto";
import { ComponentDTO } from "./component-dto";

export class AddComponentDTO {

    @IsNotEmpty()
    @Type(()=> ComponentDTO)
    readonly component: ComponentDTO;

    @IsOptional()
    @Type(() => FileUploadDTO)
    files?: FileUploadDTO;
}