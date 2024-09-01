import { Body, Controller, Get, Headers, HttpException, Post } from "@nestjs/common";
import { CalculateMealLoggingSummaryDTO } from "./dto/calculate-meal-logging-summary-dto";
import { MealLogSummaryService } from "./meal-log-summary.service";
import { CommonService } from "src/common/common.service";
import { AddMealLoggingSummaryDTO } from "./dto/add-meal-logging-summary-dto";
import { RemomveMealLoggingIdDTO } from "./dto/remove-meal-logging-id-dto";

@Controller('meal-log-summary')
export class MealLogSummaryController {
    constructor(
        private mealLogSummaryService: MealLogSummaryService,
        private commonService: CommonService
    ) {}

    @Post('add')
    async addMealLoggingSummary(@Headers() headers: any, @Body() createMealLoggingSummaryDTO: AddMealLoggingSummaryDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            // TODO:  use transaction manager 
            // create meal logging first
            // then add meal logging summary entry

            await this.mealLogSummaryService.addMealLoggingSummary(decoded_headers, createMealLoggingSummaryDTO);
        } catch (e) {
            return new HttpException(e.message, 400);
        }

    }

    @Post('calculate')
    async calculate(@Headers() headers: any, @Body() createMealLoggingSummaryDTO: CalculateMealLoggingSummaryDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            return await this.mealLogSummaryService.calculateNutritionSummary(decoded_headers, createMealLoggingSummaryDTO);
        } catch (e) {
            return new HttpException(e.message, 400);
        }

    }

    @Post('remove')
    async removeMealLoggingId(@Headers() headers: any, @Body() payload: RemomveMealLoggingIdDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            await this.mealLogSummaryService.removeMealLoggingId(decoded_headers, payload);

            // TODO:  use transaction manager 
            // remove id from meal logging summary
            // then soft delete in meal logging

            return new HttpException("Meal logging removed successfully", 200);
        } catch (e){
            return new HttpException(e.message, 400)
        }
    }
}