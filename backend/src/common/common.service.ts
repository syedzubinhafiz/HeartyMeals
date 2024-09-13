import { MeasuringUnit, conversionFactors, handMeasurementsToGrams } from "src/component/enum/measuring-unit.enum";
import * as jwt from 'jsonwebtoken';

import { User } from "src/user/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from "src/user/enum/gender.enum";
import { NutritionSettingDTO } from "src/user/dto/nutrition-setting-dto";
import { CholesterolLevel } from "src/user/enum/cholesterol.enum";


export class CommonService{

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
    * @returns an object with daily nutrition budget (calories, carbs, protein, fats, sodium, cholesterol, water_intake) in kcal, g, g, g, mg, mg, ml
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
            "fats": calories * userNutritionSetting.fatPercentage / 9,
            "sodium": sodium_intake,
            "cholesterol": cholesterol_intake,
            "water_intake": water_intake
        }

        return nutrition_budget;
   }
}