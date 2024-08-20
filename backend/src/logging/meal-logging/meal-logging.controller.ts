import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";

@Controller('meal-logging')
export class MealLoggingController {
    constructor(
        private mealLoggingService: MealLoggingService,
    ){}

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