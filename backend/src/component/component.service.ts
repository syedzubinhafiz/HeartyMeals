import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { In, Repository } from 'typeorm';
import { AddComponentDTO } from './dto/add-component-dto';
import { FoodCategory } from 'src/food-category/foodCategory.entity';
import { UserAllergy } from 'src/allergy/user_allergy.entity';
import { ComponentType } from './enum/type.enum';

@Injectable()
export class ComponentService {

    constructor(
        @InjectRepository(Component)
        private componentRepository: Repository<Component>,
        @InjectRepository(FoodCategory)
        private foodCategoryRepository: Repository<FoodCategory>,
        @InjectRepository(UserAllergy)
        private userAllergyRepository: Repository<UserAllergy>

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
        new_component.units = payload.units;
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

    async addBulk(payloads: AddComponentDTO[]) {

        // Get all unique foodCategoryIds from the payloads
        const foodCategoryIds = [...new Set(payloads.map(payload => payload.foodCategoryId))];
    
        // Fetch all food categories in a single query
        const foodCategories = await this.foodCategoryRepository.findByIds(foodCategoryIds);
    
        // Create a map for easy access to categories by id
        const foodCategoryMap = new Map<string, FoodCategory>();
        foodCategories.forEach(category => {
            foodCategoryMap.set(category.id, category);
        });
    
        const newComponents: Component[] = [];
    
        for (const payload of payloads) {
            const selectedCategory = foodCategoryMap.get(payload.foodCategoryId);
    
            if (!selectedCategory) {
                return new HttpException(`Food category not found for ID ${payload.foodCategoryId}`, 400);
            }

            const newComponent = new Component();
            newComponent.name = payload.name;
            newComponent.component_type = payload.componentType;
            newComponent.nutrition_info = payload.nutritionInformation;
            newComponent.units = payload.units;
            newComponent.amount = payload.amount;
            newComponent.foodCategory = selectedCategory;
    
            // Add storage links
            newComponent.storage_links = JSON.parse("{}");
            
            newComponents.push(newComponent);
        }
    
        try {
            await this.componentRepository.save(newComponents);
        } catch (error) {
            console.error(error);
            return new HttpException("Error saving components", 400);
        }
    
        return new HttpException("Components added successfully", 200);
    }
    
    async getComponents(decodedHeader: any, type: ComponentType) { 
        const restricted_food_cat_ids = await this.userAllergyRepository.createQueryBuilder("user_allergy")
            .select("user_allergy.food_cat_id")
            .where("user_allergy.user_id = :id", { id: decodedHeader['sub'] })
            .getMany();
    
        const food_cat_ids = restricted_food_cat_ids.map(allergy => allergy.food_cat_id);

        const query = this.componentRepository.createQueryBuilder("component")
            .select(["component.id", "component.name", "component.storage_links"])
            .where("component.component_type = :type", { type });
    
        if (food_cat_ids.length > 0) {
            query.andWhere("component.food_cat_id NOT IN (:...ids)", { ids: food_cat_ids });
        }
    
        return await query.getMany();
    }
    
    

}
