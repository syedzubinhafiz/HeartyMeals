import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { EducationalContentDTO } from "./edu-content-dto";

export class AddEducationalContentDTO{

    @IsNotEmpty()
    @Type(()=> EducationalContentDTO)
    educationalContent: EducationalContentDTO;

    @IsOptional()
    @IsString()
    educationalContentId: string;

    @IsOptional()
    @Type(()=> FileUploadDTO)
    files: FileUploadDTO;

}