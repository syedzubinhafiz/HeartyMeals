import { Body, Controller, Get, HttpException } from "@nestjs/common";
import { MealLogSummaryService } from "./meal-log-summary.service";

@Controller('meal-log-summary')
export class MealLogSummaryController {
    constructor(
        private mealLogSummaryService: MealLogSummaryService
    ) {}

    @Get('get')
    async getMealLogSummary(@Body("mealLoggingSummaryId") payload){
        try {
            return this.mealLogSummaryService.getMealLogSummary(payload);
        } catch (e){
            return new HttpException(e.messageq, 400)
        }
    }
}