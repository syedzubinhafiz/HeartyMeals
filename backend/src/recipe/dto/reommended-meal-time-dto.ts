import { IsBoolean, IsNotEmpty } from "class-validator";


export class RecommendedMealTimeDTO {

    @IsNotEmpty()
    @IsBoolean()
    readonly Breakfast: boolean;

    @IsNotEmpty()
    @IsBoolean()
    readonly Lunch: boolean;

    @IsNotEmpty()
    @IsBoolean()
    readonly Dinner: boolean;

    @IsNotEmpty()
    @IsBoolean()
    readonly Other: boolean;
    
}