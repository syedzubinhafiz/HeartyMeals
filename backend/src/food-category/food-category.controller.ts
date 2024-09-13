import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoodCategoryService } from './food-category.service';

@Controller('food_category')
export class FoodCategoryController {
    
    constructor(
        private foodCategoryService: FoodCategoryService,
    ){}

    @Get('get')
    async getFoodCategory() {
        return await this.foodCategoryService.getAllFoodCategory();
    }

    @Post('add')
    async addDietary(@Body("foodCategoryName") foodCategoryName: string){
        return await this.foodCategoryService.addFoodCategory(foodCategoryName);
    }
}
