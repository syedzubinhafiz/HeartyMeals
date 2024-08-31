import { Body, Controller, Get, Headers, HttpException } from "@nestjs/common";
import { MealLogSummaryService } from "./meal-log-summary.service";
import { CommonService } from "src/common/common.service";

@Controller('meal-log-summary')
export class MealLogSummaryController {
    constructor(
        private mealLogSummaryService: MealLogSummaryService,
        private commonService: CommonService,
    ) {}

    @Get('budget')
    async getRemainingBudget(@Headers() headers, @Body("date") payload){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            return this.commonService.getRemainingBudget(decoded_headers, payload.date);
        } catch (e){
            return new HttpException(e.messageq, 400)
        }
    }
}