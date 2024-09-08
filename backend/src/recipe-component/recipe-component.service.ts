import { RecipeComponentDTO } from './dto/recipe-component-dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Component } from "../component/component.entity";
import { EntityManager, In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Recipe } from "../recipe/recipe.entity";
import { CommonService } from 'src/common/common.service';
import { RecipeComponent } from './recipe-component.entity';
import { ComponentType } from 'src/component/enum/type.enum';
import e from 'express';

@Injectable()
export class RecipeComponentService{

    constructor(
        @InjectRepository(Component)
        private componentRepository: Repository<Component>,
        @InjectRepository(RecipeComponent)
        private recipeComponentRepository: Repository<RecipeComponent>,
        private commonService: CommonService,
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,

    ){}

    // Function Documentation ady added in different branch
    async addRecipeComponent(recipe: Recipe, componentList: RecipeComponentDTO[]) {
        // Extract all component IDs from the componentList
        const component_ids = componentList.map(rc => rc.componentId);
    
        // Fetch all required components in a single query
        const components = await this.componentRepository.find({
            where: { id: In(component_ids) },
            relations: ["foodCategory"]
          });
              
        // Create a map of components for quick lookup
        const component_map = new Map(components.map(component => [component.id, component]));
    
        // Create an array to hold new RecipeComponent instances
        const new_recipe_components = componentList.map(recipeComponent => {
            const component = component_map.get(recipeComponent.componentId);
            if (!component) {
                throw new Error(`Component with ID ${recipeComponent.componentId} not found`);
            }
    
            let newAmount = recipeComponent.amount;
            if (recipeComponent.units !== component.units) {
                newAmount = this.commonService.convertUnits(
                    recipeComponent.units,
                    recipeComponent.amount,
                    component.units,
                    component.amount
                );
            }
    
            return this.recipeComponentRepository.create({
                component_id: component.id,
                recipe_id: recipe.id,
                amount: newAmount,
                component: component,
                recipe: recipe
            });
        });
    
        // Save all new RecipeComponent instances in a single batch insert
        await this.recipeComponentRepository.save(new_recipe_components);
        const food_category_ids = components.map(component => component.foodCategory.id);

        await this.recipeRepository.update(recipe.id,{ related_food_categories: food_category_ids});
        return true;
    }

    
    /**
     * This function deletes all recipe components associated with a recipe
     * @param recipeId Recipe Id to be deleted
     * @param transactionalEntityManager Transactional entity manager
     * @returns RecipeComponent[]
     */
    public async deleteRecipeComponent(recipeId: string, transactionalEntityManager: EntityManager){ 

        try {
            // Fetch all recipe components associated with the recipe
            const recipeComponents = await this.recipeComponentRepository.find({
                where: {
                    recipe_id: recipeId
                }
            })
            
            // Delete all recipe components associated with the recipe
            await transactionalEntityManager.remove(recipeComponents);
            // Return the deleted recipe components
            return recipeComponents;

        } catch (error) {
            throw new Error(`Failed to delete recipe components: ${error.message}`);
        }
    }

    /**
     *  This function is used to get the components of a recipe
     * @param recipeId  Recipe ID to get the recipe components
     * @returns {ingredient: [], seasonings: []} List of components for the recipe
     */
    async getRecipeComponents(recipeId: string){

        // Get all the components of the recipe
        const recipe_component_list =  await this.recipeComponentRepository.find({
            where: { recipe_id: recipeId},  
        })

        const seasonings = [];
        const ingredient = [];
        
        // Iterate over the recipe components and separate them into ingridients and seasonings
        recipe_component_list.forEach(recipe_component => {
            if (recipe_component.component.component_type == ComponentType.INGREDIENT){
                ingredient.push ({
                    component_id: recipe_component.component.id,
                    name: recipe_component.component.name,
                    amount: recipe_component.amount,
                    unit: recipe_component.component.units,
                    storage_links: recipe_component.component.storage_links
                });
            } else {
                seasonings.push( {
                    component_id: recipe_component.component.id,
                    name: recipe_component.component.name,
                    amount: recipe_component.amount,
                    unit: recipe_component.component.units,
                    storage_links: recipe_component.component.storage_links
                });
            }
        });

        return {
            ingredient: ingredient,
            seasonings: seasonings
        }
    }
}