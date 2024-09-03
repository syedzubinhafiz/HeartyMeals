import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { StorageType } from "../enum/storage.enum";

export class FileFormatDTO {
    /**
     * @example
     * "firebase.jpg"
     */
    @IsString()
    @IsNotEmpty()
    fileName: string;

    /**
     * @example
     * "image/jpeg"
     */
    @IsEnum(StorageType)
    @IsNotEmpty()
    fileType: StorageType;
    
    /**
     * @example
     * 1234
     */
    @IsNumber()
    @IsNotEmpty()
    fileSize: number;

    /**
     * @example
     * /9j/4AAQSkZJRgABAQEAYABgAAD/4QBYRXhpZgAATU0AKgAAAAgAA1IBAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAABPKADAAQAAAABAAABZAAAAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMp
     */
    @IsString()
    @IsNotEmpty()
    fileDataInBase64: string;
}