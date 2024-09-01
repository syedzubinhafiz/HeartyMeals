import { MeasuringUnit } from "src/component/enum/measuring-unit.enum";
import * as jwt from 'jsonwebtoken';



export class CommonService{

    constructor(
    ){}

    convertUnits(originalUnit: MeasuringUnit, originalAmount: number, newUnit: MeasuringUnit, newAmount: number): number{

        return 0
    }

    decodeHeaders(authHeader: string){

        if (!authHeader) {
            throw new Error('Authorization header not found');
        }
    
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Token not found');
        }

        try {
            const decoded = jwt.decode(token);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    calculateNutritionAfter(userDailyBudget: Object, recipeNutritionList: Object[]): JSON{
        var nutrition_after = {} as JSON;

        nutrition_after["calories"] = userDailyBudget["calories"];
        nutrition_after["protein"] = userDailyBudget["protein"];
        nutrition_after["carbs"] = userDailyBudget["carbs"];
        nutrition_after["fats"] = userDailyBudget["fats"];
        nutrition_after["cholesterol"] = userDailyBudget["cholesterol"];
        nutrition_after["sodium"] = userDailyBudget["sodium"];

        for (const item of recipeNutritionList){
            const recipe_nutrition = item["nutrition_info"];
            const portion = item["portion"];

            nutrition_after["calories"] -= recipe_nutrition["calories"] * portion;
            nutrition_after["protein"] -= recipe_nutrition["protein"] * portion;
            nutrition_after["carbs"] -= recipe_nutrition["total_carbohydrate"] * portion;
            nutrition_after["fats"] -= recipe_nutrition["fat"] * portion;
            nutrition_after["cholesterol"] -= recipe_nutrition["cholesterol"]* portion;
            nutrition_after["sodium"] -= recipe_nutrition["sodium"] * portion;
        }

        return nutrition_after;
    }
}