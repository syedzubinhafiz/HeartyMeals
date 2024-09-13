import { RecipeComponentDTO } from './dto/recipe-component-dto';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Component } from "../component/component.entity";
import { EntityManager, In, Repository } from "typeorm";
import { HttpException, Injectable } from "@nestjs/common";
import { Recipe } from "../recipe/recipe.entity";
import { CommonService } from 'src/common/common.service';
import { RecipeComponent } from './recipe-component.entity';
import { ComponentType } from 'src/component/enum/type.enum';
import e from 'express';
import { Visibility } from 'src/recipe/enum/visibility.enum';

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
    public async addRecipeComponent(recipe: Recipe, componentList: RecipeComponentDTO[], transactionalEntityManager: EntityManager){
        try {
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
            
            // Save all new RecipeComponent instances in a single batch insert
        const recipe_component_list = await transactionalEntityManager.save(new_recipe_components);
        const food_category_ids = components.map(component => component.foodCategory.id);
        
        await transactionalEntityManager.update(Recipe, { id: recipe.id }, { related_food_categories: food_category_ids });
        return recipe_component_list;
            
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

    /**
     *  This function is used to get the components of a recipe
     * @param recipeId  Recipe ID to get the recipe components
     * @returns {ingredient: [], seasonings: []} List of components for the recipe
     */
    async getRecipeComponents(recipeId: string){

        try {
            const recipe = await this.recipeRepository.findOne({
                where: { 
                    id: recipeId,
                 }
            });

            if (recipe == null){
                throw new HttpException("Recipe not found", 400);
            }
    
    
            if (recipe.visibility == Visibility.PRIVATE && recipe.user == null){
                throw new HttpException("Recipe is not available", 400);
            }
    
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
                        unit: recipe_component.component.unit,
                        storage_links: recipe_component.component.storage_links
                    });
                } else {
                    seasonings.push( {
                        component_id: recipe_component.component.id,
                        name: recipe_component.component.name,
                        amount: recipe_component.amount,
                        unit: recipe_component.component.unit,
                        storage_links: recipe_component.component.storage_links
                    });
                }
            });
    
            return {
                ingredient: ingredient,
                seasonings: seasonings
            }
        } catch(e) {
            return e;
        }
        
    }
}