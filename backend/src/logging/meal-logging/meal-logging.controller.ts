import { Body, Controller, Post } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";

@Controller('meal-logging')
export class MealLoggingController {
    constructor(
        private mealLoggingService: MealLoggingService,
    ){}

    @Post('mark_consumed')
    async markMealConsumed(@Body("mealLoggingId") payload){
        return await this.mealLoggingService.markIsConsumed(payload.mealLoggingId);
    }
}