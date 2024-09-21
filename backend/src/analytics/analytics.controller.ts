import { CommonService } from 'src/common/common.service';
import { Body, Controller, Get, Headers, HttpException, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { getDailyAnalyticsDTO, GetMonthlyAnalyticsDTO, GetWeeklyAnalyticsDTO } from './dto/get-analythics-dto';

@Controller('analytics')
export class AnalyticsController {

    constructor(
        private analyticsService: AnalyticsService,
        private commonService: CommonService
    ){}


    /**
     *  This method is used to get the daily analytics.
     * @param headers   headers contains the authorization token.
     * @param payload   payload contains the date.
     * @returns         returns the analytics data.
     */
    @Get('daily')
    async getDailyAnalytics(@Headers() headers:any,@Query() payload: getDailyAnalyticsDTO) {

        try {
            return this.analyticsService.getDailyAnalytics(
                this.commonService.decodeHeaders(headers.authorization), 
                payload.date
            );
        } catch (e){
            return new HttpException(e.message, 400);
        }
    }


    /**
     * This endpoint is used to get the monthly analytics.
     * @param headers       headers contains the authorization token.
     * @param payload       payload contains the start date and end date.
     * @returns             returns the analytics data.
     */
    @Get('weekly')
    async getWeeklyAnalytics(
        @Headers() headers:any, 
        @Query() payload: GetWeeklyAnalyticsDTO
    ) {

        try{
            return this.analyticsService.getAnalyticsByDate(
                this.commonService.decodeHeaders(headers.authorization),  
                payload.startDate, 
                payload.endDate,
                7
            );
        } catch (e){
            return new HttpException(e.message, 400);
        }

    }


    /**
     * This endpoint is used to get the monthly analytics.
     * @param headers       headers contains the authorization token.
     * @param payload       payload contains the start date and end date.
     * @returns             returns the analytics data.
     */
    @Get('monthly')
    async getMonthlyAnalytics(
        @Headers() headers:any, 
        @Query() payload: GetMonthlyAnalyticsDTO
    ) {

        try{
            return this.analyticsService.getAnalyticsByDate(
                this.commonService.decodeHeaders(headers.authorization), 
                payload.startDate, 
                payload.endDate,
                30
            );
        } catch (e){
            return new HttpException(e.message, 400);
        }

    }
    
}
