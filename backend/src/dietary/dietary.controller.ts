import { DietaryService } from './dietary.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('dietary')
export class DietaryController {

    constructor(
        private dietaryService: DietaryService
    ){}

    @Post('add')
    async addDietary(@Body("dietaryName") dietaryName: string){
        return await this.dietaryService.addDietary(dietaryName)
    }
}
