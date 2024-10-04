import { CommonService } from 'src/common/common.service';
import { Body, Controller, Get, Headers, HttpException, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { getDailyAnalyticsDTO, GetMonthlyAnalyticsDTO, GetWeeklyAnalyticsDTO } from './dto/get-analytics-dto';
import { lastDayOfMonth, format } from 'date-fns';

@Controller('analytics')
export class AnalyticsController {

    constructor(
        private analyticsService: AnalyticsService,
        private commonService: CommonService
    ){}


    /**
     *  This method is used to get the daily analytics.
     * @param headers   headers contains the authorization token.
     * @param payload   payload contains the date and time zo.
     * @returns         returns the analytics data.
     */
    @Get('daily')
    async getDailyAnalytics(@Headers() headers:any,@Query() payload: getDailyAnalyticsDTO) {

        try {
            return this.analyticsService.getDailyAnalytics(
                this.commonService.decodeHeaders(headers.authorization), 
                payload
            );
        } catch (e){
            return new HttpException(e.message, 400);
        }
    }


    /**
     * This endpoint is used to get the monthly analytics.
     * @param headers       headers contains the authorization token.
     * @param payload       payload contains the start date, end date and time zone.
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
                payload.timeZone,
                7
            );
        } catch (e){
            return new HttpException(e.message, 400);
        }

    }


    /**
     * This endpoint is used to get the monthly analytics.
     * @param headers       headers contains the authorization token.
     * @param payload       payload contains the start date, end date and timezone.
     * @returns             returns the analytics data.
     */
    @Get('monthly')
    async getMonthlyAnalytics(
        @Headers() headers:any, 
        @Query() payload: GetMonthlyAnalyticsDTO
    ) {

        // Check if the start and end date are in the same month.
        if(new Date(payload.startDate).getMonth() !== new Date(payload.endDate).getMonth()){
            return new HttpException('The start and end date must be in the same month', 400);
        } 

        // Get the number of days in the month.
        const days_in_month = new Date(new Date(payload.startDate).getFullYear(), new Date(payload.startDate).getMonth() + 1, 0).getDate();

        // If the end date is not the last day of the month, set it to the last day of the month.
        let end_date_string = payload.endDate;
        if(new Date(payload.endDate).getDate() !== days_in_month){
            end_date_string = format(lastDayOfMonth(new Date(payload.startDate)), 'yyyy-MM-dd');

        } 

        try{
            return this.analyticsService.getAnalyticsByDate(
                this.commonService.decodeHeaders(headers.authorization), 
                payload.startDate, 
                end_date_string,
                payload.timeZone,
                days_in_month
            );
        } catch (e){
            return new HttpException(e.message, 400);
        }
    }
    
}
