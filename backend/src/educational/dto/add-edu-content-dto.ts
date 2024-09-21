import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { EducationalContentDTO } from "./edu-content-dto";
import { FileUploadDTO } from "../../storage/dto/file-upload-dto";

export class AddEducationalContentDTO{

    @IsNotEmpty()
    @Type(()=> EducationalContentDTO)
    educationalContent: EducationalContentDTO;

    @IsOptional()
    @Type(()=> FileUploadDTO)
    files: FileUploadDTO;

}