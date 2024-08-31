import { Body, Controller, Get, Headers, HttpException } from "@nestjs/common";
import { MealLogSummaryService } from "./meal-log-summary.service";
import { CommonService } from "src/common/common.service";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";

@Controller('meal-log-summary')
export class MealLogSummaryController {
    constructor(
        private mealLogSummaryService: MealLogSummaryService,
        private commonService: CommonService,
    ) {}

    @Get('budget')
    async getRemainingBudget(@Headers() headers, @Body() payload: DateValidationDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            return this.mealLogSummaryService.getRemainingBudget(decoded_headers, payload);
        } catch (e){
            return new HttpException(e.message, 400)
        }
    }
}