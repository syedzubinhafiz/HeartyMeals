import { Body, Controller, Get, Headers, HttpException, Post, Query } from '@nestjs/common';
import { FluidLoggingService } from './fluid-logging.service';
import { CommonService } from 'src/common/common.service';
import { UpdateFluidLoggingDTO } from './dto/update-fluid-logging-dto';

@Controller('fluid-logging')
export class FluidLoggingController {
    
    constructor(
        private fluidLoggingService: FluidLoggingService,
        private commonService: CommonService,
    ){}

    /**
     * Get method to get the fluid logging of the user on a specific date
     * @param headers - headers that contains the authorization token
     * @param date - query that contains the date requested to get the fluid logging from
     * @param timeZone - query that contains the time zone of the user
     * @returns fluid logging entry for the user on the given date
     */
    @Get('get')
    async getFluidLogging(@Headers() headers: any, @Query("dateTime") date, @Query("timeZone") timeZone){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);

        try {
            return await this.fluidLoggingService.getFluidLogging(decoded_headers, date, timeZone);
        } catch (e) {
            return new HttpException(e.message, 500);
        }
        
    }

    /**
     * Post method to log the fluid intake of the user
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains the fluid logging information
     * @returns HttpException 200 if the fluid is logged, and a warning if the user has exceeded the budget
     */
    @Post('update')
    async updateFluidLogging(@Headers() headers: any, @Body() payload: UpdateFluidLoggingDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);

        try {
            var status = await this.fluidLoggingService.updateFluidLogging(decoded_headers, payload);
            if (status[1] != null) {
                return new HttpException(`Fluid is logged. ${status[1]}`, 200);
            }
            return new HttpException(`Fluid is logged.`, 200);
        } catch (e) {
            return new HttpException(e.message, 500);
        }
        
    }
}
