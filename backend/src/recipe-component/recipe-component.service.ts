import { RecipeComponentDTO } from './dto/recipe-component-dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Component } from "../component/component.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Recipe } from "../recipe/recipe.entity";
import { CommonService } from 'src/common/common.service';
import { RecipeComponent } from './recipe-component.entity';

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
    
}