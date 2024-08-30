import { MeasuringUnit } from "src/component/enum/measuring-unit.enum";
import * as jwt from 'jsonwebtoken';

import { User } from "src/user/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealLogging } from "src/meal-logging/meal-logging.entity";
import { HttpException, Inject } from "@nestjs/common";
import { MealLogSummary } from "src/meal-log-summary/meal-log-summary.entity";
import { UserService } from "src/user/user.service";


export class CommonService{

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(MealLogSummary)
        private mealLogSummaryRepository: Repository<MealLogSummary>,
        private userService: UserService,
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

    calculateNutritionAfter(userDailyBudget: Object, recipeNutrition: void[], mealLoggingEntries: MealLogging[]): JSON{
        var nutrition_after = {} as JSON;

        nutrition_after["calories"] = userDailyBudget["calories"];
        nutrition_after["protein"] = userDailyBudget["protein"];
        nutrition_after["carbs"] = userDailyBudget["carbs"];
        nutrition_after["fat"] = userDailyBudget["fat"];
        nutrition_after["cholesterol"] = userDailyBudget["cholesterol"];
        nutrition_after["sodium"] = userDailyBudget["sodium"];

        // TODO: multiply with portion
        for (var i = 0; i < recipeNutrition.length; i++){
            nutrition_after["calories"] -= recipeNutrition[i]["calories"];
            nutrition_after["protein"] -= recipeNutrition[i]["protein"];
            nutrition_after["carbs"] -= recipeNutrition[i]["carbs"];
            nutrition_after["fat"] -= recipeNutrition[i]["fat"];
            nutrition_after["cholesterol"] -= recipeNutrition[i]["cholesterol"];
            nutrition_after["sodium"] -= recipeNutrition[i]["sodium"];
        }

        return nutrition_after;
    }
}