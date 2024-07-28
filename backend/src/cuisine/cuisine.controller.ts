import { Body, Controller, Post } from '@nestjs/common';
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
}
