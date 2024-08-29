import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { FluidLoggingService } from './fluid-logging.service';
import { CommonService } from 'src/common/common.service';

@Controller('fluid_logging')
export class FluidLoggingController {
    
    constructor(
        private fluidLoggingService: FluidLoggingService,
        private commonService: CommonService,
    ){}

    @Get('get')
    async getFoodCategory(@Headers() headers, @Body("date") payload) {
        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);

        return await this.fluidLoggingService.getFluidLogging(decoded_headers, payload);
    }

    @Post('add')
    async addDietary(@Headers() headers, @Body() payload){
        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);

        return await this.fluidLoggingService.updateFluidLogging(decoded_headers, payload);
    }
}
