import { Body, Controller, Get, HttpException } from "@nestjs/common";
import { MealLogSummaryService } from "./meal-log-summary.service";
import { CommonService } from "src/common/common.service";

@Controller('meal-log-summary')
export class MealLogSummaryController {
    constructor(
        private mealLogSummaryService: MealLogSummaryService,
        private commonService: CommonService,
    ) {}

    @Get('budget')
    async getRemainingBudget(@Body() payload){
        try {
            return this.commonService.getRemainingBudget(payload.user_id, payload.date);
        } catch (e){
            return new HttpException(e.messageq, 400)
        }
    }
}