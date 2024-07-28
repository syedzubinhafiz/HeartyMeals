import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddCountryDTO } from './dto/add-country-dto';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {

    constructor(private countryService: CountryService){}

    @Post()
    add(@Body() addCountryDTO: AddCountryDTO){

        return this.countryService.add(addCountryDTO);
    }

    @Get()
    findAll(){
        return this.countryService.findAll();
    }
}
