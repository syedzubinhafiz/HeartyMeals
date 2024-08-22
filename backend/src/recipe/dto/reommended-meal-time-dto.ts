import { IsBoolean, IsNotEmpty } from "class-validator";


export class RecommendedMealTimeDTO {

    @IsNotEmpty()
    @IsBoolean()
    readonly breakfast: boolean;

    @IsNotEmpty()
    @IsBoolean()
    readonly lunch: boolean;

    @IsNotEmpty()
    @IsBoolean()
    readonly dinner: boolean;
    
}