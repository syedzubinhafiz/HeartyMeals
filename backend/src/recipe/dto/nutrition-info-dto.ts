import { IsNumber } from "class-validator";

export class NutritionInfoDTO {
    
    @IsNumber()
    calories: number = 0;

    @IsNumber()
    addedSugars: number = 0; 

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
    dietaryFiber: number = 0;

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
    pantothenicAcid: number = 0;

    @IsNumber()
    phosphorus: number = 0;

    @IsNumber()
    potassium: number = 0;

    @IsNumber()
    protein: number = 0;

    @IsNumber()
    riboflavin: number = 0;

    @IsNumber()
    saturatedFat: number = 0;

    @IsNumber()
    selenium: number = 0;

    @IsNumber()
    sodium: number = 0;

    @IsNumber()
    thiamin: number = 0;

    @IsNumber()
    totalCarbohydrate: number = 0;

    @IsNumber()
    vitaminA: number = 0;

    @IsNumber()
    vitaminB6: number = 0;

    @IsNumber()
    vitaminB12: number = 0;

    @IsNumber()
    vitaminC: number = 0;

    @IsNumber()
    vitaminD: number = 0;

    @IsNumber()
    vitaminE: number = 0;

    @IsNumber()
    vitaminK: number = 0;

    @IsNumber()
    zinc: number = 0;
}