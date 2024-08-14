import { Controller, Get } from '@nestjs/common';
import { FoodCategoryService } from './food-category.service';

@Controller('food_category')
export class FoodCategoryController {
    
    constructor(
        private foodCategoryService: FoodCategoryService,
    ){}

    @Get()
    async getFoodCategory() {
        return await this.foodCategoryService.getAllFoodCategory();
    }
}
