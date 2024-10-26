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

    /**
     * Get all the food categories stored in database
     * @returns all food categories
     */
    async getAllFoodCategory(){
        return await this.foodCategoryRepository.find();
    }

    /**
     * Add a new food category to the database
     * @param newFoodCategory - new food category to be added
     * @returns the new food category added entry
     */
    async addFoodCategory(newFoodCategory: string){
        // check if the food category already exist
        if (await this.foodCategoryRepository.findOneBy({type: newFoodCategory}) != null) {
            return "Dietary already Exist."
        }

        return await this.foodCategoryRepository.save({type: newFoodCategory});
    }
}
