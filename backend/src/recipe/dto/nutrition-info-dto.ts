import { IsNumber } from "class-validator";

export class NutritionInfoDTO {
    
    @IsNumber()
    calories: number = 0;

    @IsNumber()
    added_sugars: number = 0; 

    @IsNumber()
    biotin: number = 0;

    @IsNumber()
    calcium: number = 0;

    @IsNumber()
    chloride: number = 0;

    @IsNumber()
    cholesterol: number = 0;

    @IsNumber()
    chromium: number = 0;

    @IsNumber()
    copper: number = 0;

    @IsNumber()
    dietarty_fiber: number = 0;

    @IsNumber()
    fat: number = 0;

    @IsNumber()
    folate: number = 0;

    @IsNumber()
    iodine: number = 0;

    @IsNumber()
    iron: number = 0;

    @IsNumber()
    magnesium: number = 0;

    @IsNumber()
    manganese: number = 0;

    @IsNumber()
    molybdenum: number = 0;

    @IsNumber()
    niacin: number = 0;

    @IsNumber()
    pantothenic_acid: number = 0;

    @IsNumber()
    phosphorus: number = 0;

    @IsNumber()
    potassium: number = 0;

    @IsNumber()
    protein: number = 0;

    @IsNumber()
    riboflavin: number = 0;

    @IsNumber()
    saturated_fat: number = 0;

    @IsNumber()
    selenium: number = 0;

    @IsNumber()
    sodium: number = 0;

    @IsNumber()
    thiamin: number = 0;

    @IsNumber()
    total_carbohydrate: number = 0;

    @IsNumber()
    vitamin_a: number = 0;

    @IsNumber()
    vitamin_b6: number = 0;

    @IsNumber()
    vitamin_b12: number = 0;

    @IsNumber()
    vitamin_c: number = 0;

    @IsNumber()
    vitamin_d: number = 0;

    @IsNumber()
    vitamin_e: number = 0;

    @IsNumber()
    vitamin_k: number = 0;

    @IsNumber()
    zinc: number = 0;
}