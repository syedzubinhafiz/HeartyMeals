import { IsArray, IsBoolean, IsObject, IsOptional, IsString, Validate, ValidateNested } from "class-validator";
import { FileFormatDTO } from "./file-format-dto";
import { Type } from "class-transformer";

export class FileUploadDTO{
    @IsOptional()
    @ValidateNested()
    @Type(() => FileFormatDTO)
    readonly thumbnail?: FileFormatDTO;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileFormatDTO)
    readonly content?: FileFormatDTO[];

}