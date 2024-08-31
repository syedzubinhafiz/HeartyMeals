import { Body, Controller, Get, Headers, HttpException, Post } from "@nestjs/common";
import { CreateMealLoggingSummaryDTO } from "./dto/create-meal-logging-summary-dto";
import { MealLogSummaryService } from "./meal-log-summary.service";
import { CommonService } from "src/common/common.service";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";

@Controller('meal-log-summary')
export class MealLogSummaryController {
    constructor(
        private mealLogSummaryService: MealLogSummaryService,
        private commonService: CommonService
    ) {}

    @Post('create')
    async createMealLoggingSummary(@Headers() headers: any, @Body() createMealLoggingSummaryDTO: CreateMealLoggingSummaryDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            await this.mealLogSummaryService.createMealLoggingSummary(decoded_headers, createMealLoggingSummaryDTO);
        } catch (e) {
            return new HttpException(e.message, 400);
        }

    }

    @Post('calculate')
    async calculate(@Headers() headers: any, @Body() createMealLoggingSummaryDTO: CreateMealLoggingSummaryDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            return await this.mealLogSummaryService.calculateNutritionSummary(decoded_headers, createMealLoggingSummaryDTO);
        } catch (e) {
            return new HttpException(e.message, 400);
        }

    }

    @Get('budget')
    async getRemainingBudget(@Headers() headers: any, @Body() payload: DateValidationDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            return this.mealLogSummaryService.getRemainingBudget(decoded_headers, payload);
        } catch (e){
            return new HttpException(e.message, 400)
        }
    }
}