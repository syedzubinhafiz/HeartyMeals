import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, ValidateNested, Min, Max} from "class-validator";
import { Gender } from "../enum/gender.enum";
import { NutritionSettingDTO } from "./nutrition-setting-dto";
import { Type } from "class-transformer";

export class CreateUserDTO{

    
    @IsString()
    readonly countryId: string;    

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(4)
    readonly nyhaLevel: number;

    @IsString()
    readonly dietaryId: string;

    @IsEnum(Gender)
    @IsNotEmpty()
    readonly gender: Gender;

    @IsString()
    @IsNotEmpty()
    readonly ethnicityId: string;

    @IsJSON()
    readonly medicalInfo: JSON;
    
    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message: "Age must be greater than 0"})
    readonly age: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message: "Height must be greater than 0"})
    readonly height: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0, {message: "Weight must be greater than 0"})
    readonly weight: number;

    @ValidateNested()
    @Type(() => NutritionSettingDTO)
    readonly userNutritionSetting: NutritionSettingDTO;
}