import { HttpException, Injectable } from '@nestjs/common';
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

        const selected_country = await this.countryRepository.findOneBy({id: cuisineInfo.countryId});

        if (selected_country == null){
            throw new HttpException( "Selected Country does not exist", 404);
        }
        
        if (await this.cuisineRepository.findOneBy({name: cuisineInfo.name})){
            throw new HttpException("Cuisine already exists", 409);
        }

        try {
            
            await this.cuisineRepository.save({
                name: cuisineInfo.name,
                country_id: cuisineInfo.countryId,
                country:selected_country
            })

        } catch (error) {
            return new HttpException(error.message, 500);
        }
            return new HttpException("Cuisine added successfully", 201);
        
    }   
}
