import { RecipeComponentDTO } from './dto/recipe-component-dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Component } from "../component/component.entity";
import { Repository } from "typeorm";
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
    ){}

    async addRecipeComponent(recipe: Recipe, componentList: RecipeComponentDTO[]) {
        // Extract all component IDs from the componentList
        const component_ids = componentList.map(rc => rc.componentId);
    
        // Fetch all required components in a single query
        const components = await this.componentRepository.findByIds(component_ids);
    
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

        return true;
    }

    /**
     *  This function is used to get the components of a recipe
     * @param recipeId  Recipe ID to get the recipe components
     * @returns {ingridients: [], seasonings: []} List of components for the recipe
     */
    async getRecipeComponents(recipeId: string){

        // Get all the components of the recipe
        const recipe_component_list =  await this.recipeComponentRepository.find({
            where: { recipe_id: recipeId},  
        })

        const seasonings = [];
        const ingridients = [];
        
        // Iterate over the recipe components and separate them into ingridients and seasonings
        recipe_component_list.forEach(recipe_component => {
            if (recipe_component.component.component_type == ComponentType.INGREDIENT){
                ingridients.push ({
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
            ingridients: ingridients,
            seasonings: seasonings
        }
    }
}