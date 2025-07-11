import { Body, Controller, Get, Delete, Headers, HttpException, Param, Post, Query } from '@nestjs/common';
import { AddRecipeDTO } from './dto/add-recipe-dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, getManager, Repository } from 'typeorm'; 
import { RecipeService } from './recipe.service';
import { RecipeComponentService } from '../recipe-component/recipe-component.service';
import { RecipeComponentArchiveService } from '../recipe-component-archive/recipe-component-archive.service';
import { CommonService } from '../common/common.service';
import { Recipe } from './recipe.entity';
import { StorageService } from '../storage/storage.service';

@Controller('recipe')
export class RecipeController {
    constructor(
        private readonly recipeService: RecipeService,
        private readonly recipeComponentService: RecipeComponentService,
        @InjectEntityManager() 
        private readonly entityManager: EntityManager,
        private recipeComponentArchiveService: RecipeComponentArchiveService,
        private readonly commonService: CommonService,
        private storageService: StorageService,
    ) {}

    @Post('add')
    async createRecipe(@Headers() header: any, @Body() payload: AddRecipeDTO) {
        const decoded = this.commonService.decodeHeaders(header.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const [new_recipe, is_custom] = await this.recipeService.addRecipe(decoded, payload.recipe, transactionalEntityManager);
                const recipe_component_list = await this.recipeComponentService.addRecipeComponent(new_recipe, payload.components, transactionalEntityManager)

                // If the user add recipe that is not official, calculate the nutrition info based on the recipe components
                var upload_path = "";
                if (is_custom){
                    await this.recipeService.updateNutritionInfo(new_recipe, recipe_component_list, transactionalEntityManager)
                    // get path for custom recipe
                    upload_path = this.recipeService.getPath(decoded?.['sub'] as string, new_recipe.id, new_recipe.dietary.id);
                }
                else {
                    // get path for official recipe
                    upload_path = this.recipeService.getPath(undefined, new_recipe.id, new_recipe.dietary.id);
                }

                if (payload.files != undefined){
                    await this.storageService.handleUpload(upload_path, payload.files, new_recipe, Recipe, transactionalEntityManager);
                }
            });
            return new HttpException("Recipe added successfully", 200);
        } catch (e) {
            console.error('Transaction failed:', e);
            throw new HttpException(e.message, 400);
        }
    }



    /**
     *  This endpoint is used to get the recipe based on the search criteria
     * @param headers  Authorization header
     * @param recipeId  Recipe ID to get the recipe details (optional)
     * @param page page number
     * @param pageSize page size
     * @param search search string
     * @param cuisineIds filter by cuisine ids 
     * @param dietaryIds filter by dietary ids
     * @param mealType  filter by meal type
     * @param foodCategoryIds filter by food category ids
     * @returns  Recipe list based on the search criteria or recipe details based on the recipeId
     */
    @Get('get')
    async getRecipe(
        @Headers() headers: any, 
        @Query('recipeId') recipeId?: string,
        @Query("page") page?: string,
        @Query("pageSize") pageSize?: string,
        @Query("search") search?: string,
        @Query("cuisine") cuisineIds: string = "[]",
        @Query("dietary") dietaryIds: string = "[]",
        @Query("mealType") mealType: string = "[]",
        @Query("foodCategory") foodCategoryIds: string = "[]",
    ){

        try {
            // Decode the headers to get the user_id (optional)
            let decoded_headers: any = { sub: null };
            try {
                if (headers && headers.authorization) {
                    decoded_headers = this.commonService.decodeHeaders(headers.authorization);
                }
            } catch (e) {
                // If token missing or invalid, treat as anonymous user
                decoded_headers = { sub: null };
            }
    
            // Get the page number and page size
            const page_number = page != undefined ? parseInt(page, 10) : 0;
            const page_size = pageSize != undefined ? parseInt(pageSize, 10) : 0;
    
            // Check if pagination is required
            let pagination =  false;
            if (page_number != 0 && page_size != 0){
                pagination = true
            }
    
            // Call the get recipe business logic to get the recipe
            const [recipes, total_recipe] = await this.recipeService.getRecipe(
                decoded_headers, 
                page_number, 
                page_size, 
                search || null, 
                JSON.parse(cuisineIds), 
                JSON.parse(dietaryIds), 
                JSON.parse(foodCategoryIds),
                JSON.parse(mealType),
                pagination,
                recipeId || null
            )

            // Return the recipe list or recipe details based on the pagination
            if (page_number != 0 && page_size != 0){

                var recipe_list = recipes as Recipe[];

                for (const recipe of recipe_list){
                    // Check if thumbnail is already a URL (from Pixabay) or a storage ID
                    if (recipe.storage_links['thumbnail'] && !recipe.storage_links['thumbnail'].startsWith('http')) {
                        recipe.storage_links['thumbnail'] = await this.storageService.getLink(recipe.storage_links['thumbnail']);
                    }
                    (recipe as any).instruction = undefined;
                }

                return {
                    data: recipe_list,
                    page_number,
                    page_size,
                    total_recipe,
                    totalPages: Math.ceil(total_recipe / page_size)
                }
            // If pagination is not required return the recipe list
            } else if( page_number == 0 && page_size == 0 && recipeId == null){ 
                var recipe_list = recipes as Recipe[];

                // post processing to get thumbnail link and remove instruction
                for (const recipe of recipe_list){
                    // Check if thumbnail is already a URL (from Pixabay) or a storage ID
                    if (recipe.storage_links['thumbnail'] && !recipe.storage_links['thumbnail'].startsWith('http')) {
                        recipe.storage_links['thumbnail'] = await this.storageService.getLink(recipe.storage_links['thumbnail']);
                    }
                    (recipe as any).instruction = undefined;
                }

                return recipe_list;

            // If recipeId is provided return the recipe details with components info 
            }else {
                const recipe = recipes as Recipe;

                // get link for thumbnail - check if it's already a URL (from Pixabay) or a storage ID
                if (recipe.storage_links['thumbnail'] && !recipe.storage_links['thumbnail'].startsWith('http')) {
                    recipe.storage_links['thumbnail'] = await this.storageService.getLink(recipe.storage_links['thumbnail']);
                }

                // Loop through the storage links content and replace the instruction src index with the corresponding storage link
                for (const [index, storage_id] of Object.entries(recipe.storage_links['content'])) {
                    const link = await this.storageService.getLink(storage_id as string);
                    recipe.instruction = recipe.instruction.map(instruction =>
                        instruction.includes(`src="${index}"`) ? instruction.replace(`src="${index}"`, `src="${link}"`) : instruction
                    );
                }

                const recipe_component_list = await this.recipeComponentService.getRecipeComponents(recipe.id);


                // get link for components
                for (const component of recipe_component_list.ingredients){
                    if (component.storage_links['thumbnail'] && !component.storage_links['thumbnail'].startsWith('http')) {
                        component.storage_links['thumbnail'] = await this.storageService.getLink(component.storage_links['thumbnail']);
                    }
                }
                for (const component of recipe_component_list.seasonings){
                    if (component.storage_links['thumbnail'] && !component.storage_links['thumbnail'].startsWith('http')) {
                        component.storage_links['thumbnail'] = await this.storageService.getLink(component.storage_links['thumbnail']);
                    }
                }

                return {
                    recipe: recipe,
                    components: recipe_component_list
                }
            }
        } catch (e) {
            console.log(e);
            return new HttpException(e.message, 400)
        }

    }


    /**
     * Get recipe components based on the recipeId
     * @param recipeId Recipe ID to get the recipe components
     * @returns {ingridients: [], seasonings: []} List of components for the recipe
     */
    @Get('get-components')
    async getRecipeComponents(@Query("recipeId") recipeId: string){
        const recipe_component_list = await this.recipeComponentService.getRecipeComponents(recipeId);

        // get link for components
        for (const component of recipe_component_list.ingredients){
            component.storage_links['thumbnail'] = await this.storageService.getLink(component.storage_links['thumbnail']);
        }
        for (const component of recipe_component_list.seasonings){
            component.storage_links['thumbnail'] = await this.storageService.getLink(component.storage_links['thumbnail']);
        }
        
        return recipe_component_list;
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

    /**
     * Endpoint to get the recipe of the day
     * @param headers header containing the authorization token
     * @returns Recipe of the day
     */
    @Get('recipe-of-the-day')
    async getRecipeOfTheDay(@Headers() headers: any) {
        const decoded = this.commonService.decodeHeaders(headers.authorization);
        const recipe = await this.recipeService.getRecipeOfTheDay(decoded);
        
        // Check if thumbnail is a Firebase storage ID that needs to be converted to a signed URL
        if (recipe.storage_links['thumbnail'] && !recipe.storage_links['thumbnail'].startsWith('http')) {
            recipe.storage_links['thumbnail'] = await this.storageService.getLink(recipe.storage_links['thumbnail']);
        }
        
        return recipe;
    }  



    @Get('get-custom-recipe')
    async getCustomRecipe(
        @Headers() headers: any,
        @Query("page") page?: string,
        @Query("pageSize") pageSize?: string,
        ){
        const decoded = this.commonService.decodeHeaders(headers.authorization);

        // Get the page number and page size
        const page_number = page != undefined ? parseInt(page, 10) : 1;
        const page_size = pageSize != undefined ? parseInt(pageSize, 10) : 10;


        // Call the get recipe business logic to get the recipe
        const [recipes, total_recipe] = await this.recipeService.getCustomRecipe(decoded, page_number, page_size)
        
        // post processing to get thumbnail link and remove instruction
        for (const recipe of recipes){
            recipe.storage_links['thumbnail'] = await this.storageService.getLink(recipe.storage_links['thumbnail']);
            (recipe as any).instruction = undefined;
        }
        return {
            data: recipes,
            page_number,
            page_size,
            total_recipe,
            total_pages: Math.ceil(total_recipe / page_size)
        }

    }
    
}