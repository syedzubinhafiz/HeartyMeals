import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cuisine } from './cuisine.entity';
import { Repository } from 'typeorm';
import { AddCuisineDTO } from './dto/add-cuisine-dto';
import { Country } from 'src/country/country.entity';

@Injectable()
export class CuisineService {

    constructor(
        @InjectRepository(Cuisine)
        private cuisineRepository: Repository<Cuisine>,
        @InjectRepository(Country)
        private countryRepository: Repository<Country>
    ){}


    async addCuisine(cuisineInfo: AddCuisineDTO){

        const selected_country = await this.countryRepository.findOneBy({id: cuisineInfo.country_id});

        if (selected_country == null){
            return "Selected Country does not exist"
        }

        return await this.cuisineRepository.save({
            name: cuisineInfo.name,
            country_id: cuisineInfo.country_id,
            country:selected_country
        })
    }   
}
