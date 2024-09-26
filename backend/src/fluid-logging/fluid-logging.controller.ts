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

    @Get('get')
    async getFluidLogging(@Headers() headers: any, @Query("dateTime") date, @Query("timeZone") timeZone){
        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);

        try {
            return await this.fluidLoggingService.getFluidLogging(decoded_headers, date, timeZone);
        } catch (e) {
            return new HttpException(e.message, 500);
        }
        
    }

    @Post('update')
    async updateFluidLogging(@Headers() headers: any, @Body() payload: UpdateFluidLoggingDTO){
        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);

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
