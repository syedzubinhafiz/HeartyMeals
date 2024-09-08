import { Body, Controller, Post, Get } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { AddCuisineDTO } from './dto/add-cuisine-dto';

@Controller('cuisine')
export class CuisineController {

    constructor(
        private cuisineService: CuisineService
    ){}

    @Post()
    async addCuisine(@Body() payload: AddCuisineDTO){

        return await this.cuisineService.addCuisine(payload);
    }


    /**
     *  This endpoint is used to get all the cuisine
     * @returns list of cuisine in the database
     */
    @Get()
    async getAllCuisine(){

        return await this.cuisineService.getAllCuisine();
    }
}
