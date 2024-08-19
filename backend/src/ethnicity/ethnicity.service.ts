import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ethnicity } from './ethnicity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EthnicityService {
    
    constructor(
        @InjectRepository(Ethnicity)
        private ethnicityRepository: Repository<Ethnicity>
    ){}


    async getAllEthnicities(){
        return await this.ethnicityRepository.find();
    }

    add(newEthnicity){
        return this.ethnicityRepository.save(newEthnicity);
    }
}
