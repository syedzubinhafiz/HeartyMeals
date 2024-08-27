import { Body, Controller, Headers, HttpException, Post } from "@nestjs/common";
import { CreateMealLoggingSummaryDTO } from "./dto/create-meal-logging-summary-dto";
import { MealLogSummaryService } from "./meal-log-summary.service";
import { CommonService } from "src/common/common.service";

@Controller('meal-log-summary')
export class MealLogSummaryController {
    constructor(
        private mealLogSummaryService: MealLogSummaryService,
        private commonService: CommonService
    ) {}

    @Post('create')
    async createMealLoggingSummary(@Headers() headers: any, @Body() createMealLoggingSummaryDTO: CreateMealLoggingSummaryDTO){
        try {
            const decodedHeaders = this.commonService.decodeHeaders(headers.authorization);
            await this.mealLogSummaryService.createMealLoggingSummary(decodedHeaders, createMealLoggingSummaryDTO);
        } catch (e) {
            return new HttpException(e.message, 400);
        }

    }
}