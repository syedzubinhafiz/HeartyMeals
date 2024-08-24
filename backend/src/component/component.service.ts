import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { In, Repository } from 'typeorm';
import { AddComponentDTO } from './dto/add-component-dto';
import { FoodCategory } from 'src/food-category/foodCategory.entity';

@Injectable()
export class ComponentService {

    constructor(
        @InjectRepository(Component)
        private componentRepository: Repository<Component>,
        @InjectRepository(FoodCategory)
        private foodCategoryRepository: Repository<FoodCategory>
    ){}   

    async add(payload: AddComponentDTO) {

        const new_component =  new Component();
        const selected_category =  await this.foodCategoryRepository.findOneBy({id: payload.foodCategoryId});

        if (selected_category == null){
            return new HttpException("Food category not found", 400);
        }
        
        new_component.name = payload.name;
        new_component.component_type = payload.componentType;
        new_component.nutrition_info = payload.nutritionInformation;
        new_component.unit = payload.unit;
        new_component.amount = payload.amount;
        new_component.foodCategory = selected_category;


        //TODO: Add storage links
        new_component.storage_links = JSON.parse("{}");

        try{
            await this.componentRepository.save(new_component);
        } catch {
            return new HttpException("Error saving component", 400);
        }

        return new HttpException("Component added successfully", 200);
    }
}
