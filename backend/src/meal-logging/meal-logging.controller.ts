import { Body, Controller, Get, HttpException, Post } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";

@Controller('meal-logging')
export class MealLoggingController {
    constructor(
        private mealLoggingService: MealLoggingService,
    ){}

    @Get('get_meals')
    async getMealsPerDay(@Body() payload){
        try {
            return await this.mealLoggingService.getMealsPerDay(payload.userId, payload.date);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }
    }

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