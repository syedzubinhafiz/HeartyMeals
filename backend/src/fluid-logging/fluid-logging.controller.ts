import { Body, Controller, Get, Headers, HttpException, Post } from '@nestjs/common';
import { FluidLoggingService } from './fluid-logging.service';
import { CommonService } from 'src/common/common.service';

@Controller('fluid-logging')
export class FluidLoggingController {
    
    constructor(
        private fluidLoggingService: FluidLoggingService,
        private commonService: CommonService,
    ){}

    @Get('get')
    async getFluidLogging(@Headers() headers, @Body("date") payload) {
        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);

        try {
            return await this.fluidLoggingService.getFluidLogging(decoded_headers, payload);
        } catch (e) {
            return new HttpException(e.message, 500);
        }
        
    }

    @Post('update')
    async updateFluidLogging(@Headers() headers, @Body() payload){
        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);

        try {
            await this.fluidLoggingService.updateFluidLogging(decoded_headers, payload);
            return new HttpException("Fluid is logged.", 200);
        } catch (e) {
            return new HttpException(e.message, 500);
        }
        
    }
}
