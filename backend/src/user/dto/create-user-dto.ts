import { IsNotEmpty, IsNumber, IsString, IsEnum, IsJSON, ValidateNested, Min, Max} from "class-validator";
import { Gender } from "../enum/gender.enum";
import { NutritionSettingDTO } from "./nutrition-setting-dto";
import { Type } from "class-transformer";

export class CreatUserDTO{

    
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
    readonly age: number;

    @IsNumber()
    @IsNotEmpty()
    readonly height: number;

    @IsNumber()
    @IsNotEmpty()
    readonly weight: number;

    @ValidateNested()
    @Type(() => NutritionSettingDTO)
    readonly userNutritionSetting: NutritionSettingDTO;
}