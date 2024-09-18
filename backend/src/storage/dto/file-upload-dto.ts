import { IsArray, IsBoolean, IsObject, IsOptional, IsString, Validate, ValidateNested } from "class-validator";
import { FileFormatDTO } from "./file-format-dto";
import { Type } from "class-transformer";

export class FileUploadDTO{
    @IsOptional()
    @IsString()
    path?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => FileFormatDTO)
    thumbnail?: FileFormatDTO;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileFormatDTO)
    content?: FileFormatDTO[];

}