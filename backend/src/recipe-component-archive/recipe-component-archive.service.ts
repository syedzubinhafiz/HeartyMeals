import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RecipeComponentArchive } from "./recipe-component-archive.entity";
import { EntityManager, Repository } from "typeorm";
import { Recipe } from "src/recipe/recipe.entity";
import { Component } from "src/component/component.entity";
import { RecipeComponent } from "src/recipe-component/recipe-component.entity";

@Injectable()
export class RecipeComponentArchiveService {

    constructor(      
    ){}

    public addToArchive(recipeComponets: RecipeComponent[], transactionalEntityManager: EntityManager) {
        
        try {
            const archive_list = [ ];

            recipeComponets.forEach(recipeComponent => {
            
            const archive_recipe_component =  new RecipeComponentArchive();
            archive_recipe_component.component_id = recipeComponent.component_id;
            archive_recipe_component.recipe_id = recipeComponent.recipe_id;
            archive_recipe_component.amount = recipeComponent.amount;
            archive_recipe_component.component = recipeComponent.component;
            archive_recipe_component.recipe = recipeComponent.recipe;

            archive_list.push(archive_recipe_component);
            });

            transactionalEntityManager.save(archive_list);
    
        } catch (e) {
            throw new Error("Error adding recipe components to archive");
        } 
        
    }
}