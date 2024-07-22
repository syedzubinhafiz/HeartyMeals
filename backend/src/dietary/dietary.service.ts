import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dietary } from './dietary.entitry';
import { Repository } from 'typeorm';

@Injectable()
export class DietaryService {

    constructor(
        @InjectRepository(Dietary)
        private dietaryRepo: Repository<Dietary>,
    ){}

    async addDietary(dietaryName: string){

        const [dietaryList, count] = await this.dietaryRepo.findAndCountBy({name:dietaryName});

        if(count >= 1){
            return "Dietary already Exist."
        } 

        return await this.dietaryRepo.save({name:dietaryName})
        
    }
}
