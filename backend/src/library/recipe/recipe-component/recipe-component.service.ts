import { RecipeComponentDTO } from './dto/recipe-component-dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Component } from "../component/component.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Recipe } from "../recipe.entity";
import { CommonService } from 'src/common/common.service';
import { RecipeComponent } from './recipe-component.entity';

@Injectable()
export class RecipeComponentService{

    constructor(
        @InjectRepository(Component)
        private componentRepo: Repository<Component>,
        @InjectRepository(RecipeComponent)
        private recipeComponentRepo: Repository<RecipeComponent>,
        private commonService: CommonService,
    ){}

    async addRecipeComponent(recipe: Recipe, componentList: RecipeComponentDTO[]) {
        // Extract all component IDs from the componentList
        const componentIds = componentList.map(rc => rc.component_id);
    
        // Fetch all required components in a single query
        const components = await this.componentRepo.findByIds(componentIds);
    
        // Create a map of components for quick lookup
        const componentMap = new Map(components.map(component => [component.id, component]));
    
        // Create an array to hold new RecipeComponent instances
        const newRecipeComponents = componentList.map(recipeComponent => {
            const component = componentMap.get(recipeComponent.component_id);
            if (!component) {
                throw new Error(`Component with ID ${recipeComponent.component_id} not found`);
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
    
            return this.recipeComponentRepo.create({
                component_id: component.id,
                recipe_id: recipe.id,
                amount: newAmount,
                component: component,
                recipe: recipe
            });
        });
    
        // Save all new RecipeComponent instances in a single batch insert
        await this.recipeComponentRepo.save(newRecipeComponents);

        return true;
    }
    
}