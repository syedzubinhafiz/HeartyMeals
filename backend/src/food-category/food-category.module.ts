import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodCategory } from './foodCategory.entity';
import { FoodCategoryController } from './food-category.controller';
import { FoodCategoryService } from './food-category.service';

@Module({
    imports: [TypeOrmModule.forFeature([FoodCategory])],
    controllers: [FoodCategoryController],
    providers: [FoodCategoryService]
})
export class FoodCategoryModule {}
