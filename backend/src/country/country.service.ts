import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { Repository } from 'typeorm';
import { AddCountryDTO } from './dto/add-country-dto';

@Injectable()
export class CountryService {

    constructor(
        @InjectRepository(Country)
        private countryRepository: Repository<Country>
    ){}

    async add( countryDTO: AddCountryDTO){

        const country = new Country();

        country.id = countryDTO.id;
        country.name = countryDTO.name;

        return await this.countryRepository.save(country);

    }
    
    async findAll(): Promise<Country[]>{
        return await this.countryRepository.find();
    }
}
