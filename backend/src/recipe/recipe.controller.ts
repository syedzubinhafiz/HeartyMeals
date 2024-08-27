import { Body, Controller, Delete, Headers, HttpException, Post } from '@nestjs/common';
import { AddRecipeDTO } from './dto/add-recipe-dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { EntityManager, getManager, Repository } from 'typeorm';
import { RecipeService } from './recipe.service';
import { RecipeComponentService } from '../recipe-component/recipe-component.service';
import { CommonService } from 'src/common/common.service';
import { RecipeComponentArchiveService } from 'src/recipe-component-archive/recipe-component-archive.service';

@Controller('recipe')
export class RecipeController {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private recipeService: RecipeService,
        private recipeComponentService: RecipeComponentService,
        private commonService: CommonService,
        @InjectEntityManager() 
        private readonly entityManager: EntityManager,
        private recipeComponentArchiveService: RecipeComponentArchiveService,
    ){}
    
    @Post('add')
    async createRecipe(@Headers() header: any, @Body() payload: AddRecipeDTO) {
        const decoded = this.commonService.decodeHeaders(header.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const [new_recipe, is_custom] = await this.recipeService.addRecipe(decoded, payload.recipe, transactionalEntityManager);
                const recipe_component_list = await this.recipeComponentService.addRecipeComponent(new_recipe, payload.components, transactionalEntityManager)

                // If the user add recipe that is not official, calculate the nutrition info based on the recipe components
                if (is_custom){
                    await this.recipeService.updateNutritionInfo(new_recipe, recipe_component_list, transactionalEntityManager)
                }
            });
            return new HttpException("Recipe added successfully", 200);
        } catch (e) {
            console.error('Transaction failed:', e);
            throw new HttpException(e.message, 400);
        }
    }

    
    /**
     * Endpoint to delete a recipe
     * @param headers header containing the authorization token
     * @param recipeId recipe id to delete
     * @returns  HttpException
     */
    @Delete('delete')
    async deleteRecipe(@Headers() headers: any, @Body('recipeId') recipeId: string) {

        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);
    
        try {

            // Transaction to delete recipe and its components
            await this.entityManager.transaction(async transactionalEntityManager => {

                // Call delete recipe business logic to delete a recipe
                await this.recipeService.deleteRecipe(decodedHeaders, recipeId, transactionalEntityManager);

                // Call delete recipe component business logic to delete recipe components
                const recipeComponents = await this.recipeComponentService.deleteRecipeComponent(recipeId, transactionalEntityManager);

                // Call add to archive business logic to add recipe components to archive
                await this.recipeComponentArchiveService.addToArchive(recipeComponents, transactionalEntityManager);

            });

            return new HttpException("Recipe deleted successfully", 200);

        } catch (e) {

            throw new HttpException(e.message, 400);

        }
    }
    
}


