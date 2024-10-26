import { Body, Controller, Post, Get } from '@nestjs/common';
import { CuisineService } from './cuisine.service';
import { AddCuisineDTO } from './dto/add-cuisine-dto';

@Controller('cuisine')
export class CuisineController {

    constructor(
        private cuisineService: CuisineService
    ){}

    /**
     * Post method to  add a new cuisine to the database
     * @param payload - payload that contains the cuisine information
     * @returns the cuisine entry added to the database
     */
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
