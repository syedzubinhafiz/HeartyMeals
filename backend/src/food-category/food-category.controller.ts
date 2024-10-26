import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoodCategoryService } from './food-category.service';

@Controller('food_category')
export class FoodCategoryController {
    
    constructor(
        private foodCategoryService: FoodCategoryService,
    ){}

    /**
     * Get method to get all the food categories stored in the database
     * @returns all food categories
     */
    @Get('get')
    async getFoodCategory() {
        return await this.foodCategoryService.getAllFoodCategory();
    }

    /**
     * Post method to add a new food category to the database
     * @param foodCategoryName - new food category to be added
     * @returns the new food category added entry
     */
    @Post('add')
    async addDietary(@Body("foodCategoryName") foodCategoryName: string){
        return await this.foodCategoryService.addFoodCategory(foodCategoryName);
    }
}
