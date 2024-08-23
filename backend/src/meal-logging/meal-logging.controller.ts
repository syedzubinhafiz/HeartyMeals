import { Body, Controller, Get, HttpException, Post } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";

@Controller('meal-logging')
export class MealLoggingController {
    constructor(
        private mealLoggingService: MealLoggingService,
    ){}

    /**
     * Post method to create all the meal loggings entry 
     * @param payload - payload containing userId, recipeIdList, and mealType
     * @returns HttpExecption 200 when all the meals have been logged
     */
    @Post('add')
    async addMealLogging(@Body() payload){
        try {
            await this.mealLoggingService.addMealLogging(payload.userId, payload.recipeIdList, payload.mealType);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }
        return new HttpException("Meals have been logged.", 200);
    }

    /**
     * Get method to get all the meals in a specific date
     * @param payload - payload that contains the userId and the date requested to get the meals from
     * @returns a list of meals on the date, sorted by meal types
     */
    @Get('get_meals')
    async getMealsPerDay(@Body() payload){
        try {
            return await this.mealLoggingService.getMealsPerDay(payload.userId, payload.date);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }
    }

    /**
     * Post method to mark a meal is consumed
     * @param payload - payload that contains the specific meal logging id
     * @returns HttpException 200 when the meal is successfully marked consumed
     */
    @Post('mark_consumed')
    async markMealConsumed(@Body("mealLoggingId") payload){
        try {
            await this.mealLoggingService.markIsConsumed(payload.mealLoggingId);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }

        return new HttpException("Meal is marked consumed.", 200);
    }
}