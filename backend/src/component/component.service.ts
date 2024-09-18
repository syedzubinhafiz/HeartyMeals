import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { FoodCategory } from 'src/food-category/foodCategory.entity';
import { UserAllergy } from 'src/allergy/user_allergy.entity';
import { ComponentType } from './enum/type.enum';
import { ComponentDTO } from './dto/component-dto';

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

    /**
     * This function is used to add a single component
     * @param payload component details
     * @returns status of the operation
     */
    async add(payload: ComponentDTO, transactionalEntityManager: EntityManager) {

        
        const new_component =  new Component();

        // Check if the food category exists
        const selected_category =  await this.foodCategoryRepository.findOneBy({id: payload.foodCategoryId});

        // If the food category does not exist, return an error
        if (selected_category == null){
            return new HttpException("Food category not found", 400);
        }
        
        // Add the component details
        new_component.name = payload.name;
        new_component.component_type = payload.componentType;
        new_component.nutrition_info = payload.nutritionInformation;
        new_component.unit = payload.unit;
        new_component.amount = payload.amount;
        new_component.foodCategory = selected_category;


        //TODO: Add storage links
        new_component.storage_links = JSON.parse("{}");

        // Save the new component
        try{
            return await transactionalEntityManager.save(new_component);
        } catch {
            throw new HttpException("Error saving component", 400);
        }
    }

    /**
     *  This function is used to add multiple components in a single request
     * @param payloads list of components to be added
     * @returns status of the operation
     */
    async addBulk(payloads: ComponentDTO[], transactionalEntityManager: EntityManager) {

        // Get all unique foodCategoryIds from the payloads
        const food_category_ids = [...new Set(payloads.map(payload => payload.foodCategoryId))];
    
        // Fetch all food categories in a single query
        const food_categories = await this.foodCategoryRepository.findByIds(food_category_ids);
    
        // Create a map for easy access to categories by id
        const food_category_map = new Map<string, FoodCategory>();
        food_categories.forEach(category => {
            food_category_map.set(category.id, category);
        });
    
        const new_components: Component[] = [];
        try {
            // Create new components from the payloads
            for (const payload of payloads) {
                const selected_category = food_category_map.get(payload.foodCategoryId);
        
                if (!selected_category) {
                    throw new HttpException(`Food category not found for ID ${payload.foodCategoryId}`, 400);
                }

                const new_component = new Component();
                new_component.name = payload.name;
                new_component.component_type = payload.componentType;
                new_component.nutrition_info = payload.nutritionInformation;
                new_component.unit = payload.unit;
                new_component.amount = payload.amount;
                new_component.foodCategory = selected_category;
        
                // Add storage links
                new_component.storage_links = JSON.parse("{}");
                
                new_components.push(new_component);
            }
        
            // Save all new components in a single batch insert
        
            return await transactionalEntityManager.save(new_components);
        } catch (error) {
            console.error(error);
            throw new HttpException("Error saving components", 400);
        }
    }

    /**
     *  This function is used to get components based on the component type, page and page size
     * @param decodedHeader decoded header with user info 
     * @param componentType type of component 
     * @param page current page
     * @param pageSize limit of components per page
     * @returns list of components and total count
     */
    async getComponents(
        decodedHeader: any, 
        componentType: ComponentType, 
        page: number, 
        pageSize: number, 
        pagination: boolean, 
        search: string
    ): Promise<[Component[], number]> {

        // Calculate the number of items to skip
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        
        // Get all restricted food categories for the user
        const restricted_food_cat_ids = await this.userAllergyRepository.createQueryBuilder("user_allergy")
            .select("user_allergy.food_cat_id")
            .where("user_allergy.user_id = :id", { id: decodedHeader['sub'] })
            .getMany();
    
        // Extract all food category IDs from the restricted categories
        const food_cat_ids = restricted_food_cat_ids.map(allergy => allergy.food_cat_id);

        // Create a query builder for components
        const query = this.componentRepository.createQueryBuilder("component")
            .select(["component.id", "component.name", "component.storage_links"])
            .where("component.component_type = :type", { type:componentType });


        if (search != null){
            query.andWhere("component.name ILIKE :search", { search: `%${search}%` });

        }
    

        // If there are restricted food categories, exclude them from the query
        if (food_cat_ids.length > 0) {
            query.andWhere("component.food_cat_id NOT IN (:...ids)", { ids: food_cat_ids });
        }

        if (pagination){
            // Execute the query with pagination
            query.skip(skip)
                .take(take);
        }
        
        const [result, length] = await query.getManyAndCount();

        return  [result, length];
    }
    
    
    getPath(foodCategoryId: string, entryId: string): string {
        return `component/${foodCategoryId}/${entryId}`;
    }
}
