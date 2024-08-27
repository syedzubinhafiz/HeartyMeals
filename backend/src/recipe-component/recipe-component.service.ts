import { RecipeComponentDTO } from './dto/recipe-component-dto';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Component } from "../component/component.entity";
import { EntityManager, Repository } from "typeorm";
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

    public async addRecipeComponent(recipe: Recipe, componentList: RecipeComponentDTO[], transactionalEntityManager: EntityManager){
        try {
            // Extract all component IDs from the componentList
            const component_ids = componentList.map(rc => rc.componentId);
        
            // Fetch all required components in a single query
            const components = await this.componentRepository.findByIds(component_ids);
            console.log('Fetched components:', components);
        
            // Create a map of components for quick lookup
            const component_map = new Map(components.map(component => [component.id, component]));
        
            // Create an array to hold new RecipeComponent instances
            const new_recipe_components = componentList.map(recipe_component => {
                const component = component_map.get(recipe_component.componentId);
                if (!component) {
                    throw new Error(`Component with ID ${recipe_component.componentId} not found`);
                }
        
                let new_amount = recipe_component.amount;
                if (recipe_component.unit !== component.unit) {
                    new_amount = this.commonService.convertUnit(
                        recipe_component.unit,
                        recipe_component.amount,
                        component.unit,
                    ); 
                }
        
                return this.recipeComponentRepository.create({
                    component_id: component.id,
                    recipe_id: recipe.id,
                    amount: new_amount,
                    component: component,
                    recipe: recipe
                });
            });
            
            console.log('New recipe components:', new_recipe_components);
            
            // Save all new RecipeComponent instances in a single batch insert
            return transactionalEntityManager.save(new_recipe_components);
            
        } catch (error) {
            throw new Error(error);
        }
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
    
}