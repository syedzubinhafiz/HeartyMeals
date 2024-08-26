import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dietary } from './dietary.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DietaryService {

    constructor(
        @InjectRepository(Dietary)
        private dietaryRepo: Repository<Dietary>,
    ){}

    async getAllDietary(){
        return await this.dietaryRepo.find();
    }

    async addDietary(dietaryName: string){

        if (await this.dietaryRepo.findOneBy({name: dietaryName}) != null) {
            return "Dietary already Exist."
        }

        return await this.dietaryRepo.save({name: dietaryName})
    }
}
