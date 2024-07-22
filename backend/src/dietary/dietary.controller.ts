import { DietaryService } from './dietary.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('dietary')
export class DietaryController {

    constructor(
        private dietaryService: DietaryService
    ){}

    @Post('add')
    async addDietary(@Body() dietaryName: string){
        
        return await this.dietaryService.addDietary(dietaryName)

    }
}
