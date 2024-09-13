import { Body, Controller, Get, Headers, HttpException, Query } from "@nestjs/common";
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
    async getRemainingBudget(@Headers() headers, @Query("date") date: string){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);
            const dateValidationDTO = new DateValidationDTO();
            dateValidationDTO.date = date;

            return this.mealLogSummaryService.getRemainingBudget(decoded_headers, dateValidationDTO);
        } catch (e){
            return new HttpException(e.message, 400)
        }
    }
}