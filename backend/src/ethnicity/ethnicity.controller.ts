import { Controller, Get } from '@nestjs/common';
import { EthnicityService } from './ethnicity.service';

@Controller('ethnicity')
export class EthnicityController {
    
    constructor(
        private ethnicityService: EthnicityService,
    ){}

    @Get()
    async getEthnicities() {
        return await this.ethnicityService.getAllEthnicities();
    }
}
