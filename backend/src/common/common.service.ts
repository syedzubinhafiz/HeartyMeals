import { MeasuringUnit, conversionFactors, handMeasurementsToGrams } from "src/component/enum/measuring-unit.enum";
import * as jwt from 'jsonwebtoken';

import { Gender } from "src/user/enum/gender.enum";
import { NutritionSettingDTO } from "src/user/dto/nutrition-setting-dto";
import { CholesterolLevel } from "src/user/enum/cholesterol.enum";


export class CommonService{

    constructor(

    ){}

    convertUnit(originalUnit: MeasuringUnit, originalAmount: number, newUnit: MeasuringUnit): number{

        if (originalUnit === newUnit) {
            return originalAmount;
        }
    
        // Convert hand measurements to grams first
        if (handMeasurementsToGrams[originalUnit]) {
            originalAmount *= handMeasurementsToGrams[originalUnit];
            originalUnit = MeasuringUnit.GRAM;
        }
    
        // Convert grams to hand measurements
        if (originalUnit === MeasuringUnit.GRAM && handMeasurementsToGrams[newUnit]) {
            return originalAmount / handMeasurementsToGrams[newUnit];
        }
    
        // Convert grams to the target unit
        if (conversionFactors[originalUnit] && conversionFactors[newUnit]) {
            const amountInGramsOrMl = originalAmount * conversionFactors[originalUnit];
            return amountInGramsOrMl / conversionFactors[newUnit];
        }
    
        throw new Error(`Conversion from ${originalUnit} to ${newUnit} is not supported.`);
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

    /**
     * Checks the date format
     * @param date - date to validate
     * @returns true if the date is in the format of YYYY-MM-DDTHH:MM:SS.SSS+-HHMM else false
     */
    validateDate(date: string): boolean{
        // check for valid date format
        const date_pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}$/;
        if (!date || !date_pattern.test(date)) { return false; }
        return true;
    }

    /**
     * Checks if the two dates are the same day
     * @param date1 - first date in Date object
     * @param date2 - second date in Date object
     * @returns true if the two dates are the same day, else false
     */
    isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.toDateString() === date2.toDateString()
        );
      }


    /**
     * Calculate the calories required for intake based on user information
     * @param gender - user gender in Enum
     * @param age - user age in years
     * @param height - user height in cm
     * @param weight - user weight in kg
     * @param userNutritionSetting - user nutrition setting
     * @returns bmr (calories) - basal metabolic rate in kcal/day 
     */
    calculateCalories(gender: Gender, age: number, height: number, weight: number, userNutritionSetting: NutritionSettingDTO){
        // weight, height in kg, cm
        // calculate BMR in kcal/day
        var bmr = 0;

        if (gender == Gender.MALE){
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        }
        else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }


        // multiply by activity level
        switch (userNutritionSetting.activityLevel){
            case 1:
                bmr *= 1.2;
                break;
            case 2:
                bmr *= 1.4;
                break;
            case 3:
                bmr *= 1.6;
                break;
            case 4:
                bmr *= 1.75;
                break;
            case 5:
                bmr *= 2.0;
                break;
        }
        
        // output is the calories required to maintain your weight
        return bmr;
   }

   /**
    * Calculate the daily nutrition budget based on user nutrition settings and nyha level
    * @param calories - daily calories intake
    * @param userNutritionSetting - user nutrition setting
    * @param nyhaLevel - user nyha level
    * @returns an object with daily nutrition budget (calories, carbs, protein, fat, sodium, cholesterol, water_intake) in kcal, g, g, g, mg, mg, ml
    */
   calculateNutritionBudget(calories: number, userNutritionSetting: NutritionSettingDTO, nyhaLevel: number){

        // get sodium intake in mg and water intake in ml based on nyha level
        var sodium_intake = 0;
        var water_intake = 0;
        switch (nyhaLevel){
           case 1:
                sodium_intake = 2300;
                water_intake = 2500;
                break;
            case 2:
                sodium_intake = 2000;
                water_intake = 2000;
                break;
            case 3:
                sodium_intake = 1500;
                water_intake = 1600;   // around 1500 ml, so take a bit extra to be safe
                break;
            case 4:
                sodium_intake = 1000;
                water_intake = 1250; // range from 1000 to 1500 ml, 1250 is the average
                break;
        }

        // get choulesterol intake in mg based on user selection
        var cholesterol_intake = 0;
        switch (userNutritionSetting.cholesterolLevel){
            case CholesterolLevel.HIGH:
                cholesterol_intake = 200;
                break;
            case CholesterolLevel.NORMAL:
                cholesterol_intake = 300;
                break;
            case CholesterolLevel.LOW:
                cholesterol_intake = 400;
                break;
        }


        // calculate the nutrition budget based on the percentage of calories, convert calories to specific macronutrients grams
        // 1g of carbs = 4 kcal, 1g of protein = 4 kcal, 1g of fat = 9 kcal
        const nutrition_budget = {
            "calories": calories,
            "carbs": calories * userNutritionSetting.carbsPercentage / 4,
            "protein": calories * userNutritionSetting.proteinPercentage / 4,
            "fat": calories * userNutritionSetting.fatPercentage / 9,
            "sodium": sodium_intake,
            "cholesterol": cholesterol_intake,
            "water_intake": water_intake
        }

        // Round the values to 2 decimal places
        nutrition_budget.calories = parseFloat(nutrition_budget.calories.toFixed(2));
        nutrition_budget.carbs = parseFloat(nutrition_budget.carbs.toFixed(2));
        nutrition_budget.protein = parseFloat(nutrition_budget.protein.toFixed(2));
        nutrition_budget.fat = parseFloat(nutrition_budget.fat.toFixed(2));
        nutrition_budget.sodium = parseFloat(nutrition_budget.sodium.toFixed(2));
        nutrition_budget.cholesterol = parseFloat(nutrition_budget.cholesterol.toFixed(2));
        nutrition_budget.water_intake = parseFloat(nutrition_budget.water_intake.toFixed(2));

        return nutrition_budget;
   }

    

    calculateNutritionAfter(userDailyBudget: Object, recipeNutritionList: Object[]): JSON{
        var nutrition_after = {} as JSON;

        nutrition_after["calories"] = userDailyBudget["calories"];
        nutrition_after["protein"] = userDailyBudget["protein"];
        nutrition_after["carbs"] = userDailyBudget["carbs"];
        nutrition_after["fat"] = userDailyBudget["fat"];
        nutrition_after["cholesterol"] = userDailyBudget["cholesterol"];
        nutrition_after["sodium"] = userDailyBudget["sodium"];

        for (const item of recipeNutritionList){
            const recipe_nutrition = item["nutrition_info"];
            const meal_logging_portion = item["meal_logging_portion"];
            const recipe_portion = item["recipe_portion"];

            nutrition_after["calories"] -= recipe_nutrition["calories"] * meal_logging_portion / recipe_portion;
            nutrition_after["protein"] -= recipe_nutrition["protein"] * meal_logging_portion / recipe_portion;
            nutrition_after["carbs"] -= recipe_nutrition["totalCarbohydrate"] * meal_logging_portion / recipe_portion;
            nutrition_after["fat"] -= recipe_nutrition["fat"] * meal_logging_portion / recipe_portion;
            nutrition_after["cholesterol"] -= recipe_nutrition["cholesterol"]* meal_logging_portion / recipe_portion;
            nutrition_after["sodium"] -= recipe_nutrition["sodium"] * meal_logging_portion / recipe_portion;
        }

        // Round the values to 2 decimal places
        nutrition_after["calories"] = parseFloat(nutrition_after["calories"].toFixed(2));
        nutrition_after["protein"] = parseFloat(nutrition_after["protein"].toFixed(2));
        nutrition_after["carbs"] = parseFloat(nutrition_after["carbs"].toFixed(2));
        nutrition_after["fat"] = parseFloat(nutrition_after["fat"].toFixed(2));
        nutrition_after["cholesterol"] = parseFloat(nutrition_after["cholesterol"].toFixed(2));
        nutrition_after["sodium"] = parseFloat(nutrition_after["sodium"].toFixed(2))

        return nutrition_after;
    }
}