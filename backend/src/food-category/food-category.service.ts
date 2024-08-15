import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodCategory } from './foodCategory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FoodCategoryService {
    
    constructor(
        @InjectRepository(FoodCategory)
        private foodCategoryRepository: Repository<FoodCategory>
    ){}


    async getAllFoodCategory(){
        return await this.foodCategoryRepository.find();
    }

    async addFoodCategory(newFoodCategory: string){
        if (await this.foodCategoryRepository.findOneBy({type: newFoodCategory}) != null) {
            return "Dietary already Exist."
        }

        return await this.foodCategoryRepository.save({type: newFoodCategory});
    }
}
