import { Body, Controller, Get, Headers, Delete, HttpException, Param, Post, Query } from '@nestjs/common';
import { AddRecipeDTO } from './dto/add-recipe-dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserRole } from 'src/user/enum/user-role.enum';
import { RecipeService } from './recipe.service';
import { RecipeComponentService } from 'src/recipe-component/recipe-component.service';
import { RecipeComponentArchiveService } from 'src/recipe-component-archive/recipe-component-archive.service';
import { CommonService } from 'src/common/common.service';
import { Recipe } from './recipe.entity';


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
    async createRecipe(@Body() payload: AddRecipeDTO){

        // Get user from user 
        let user = await this.userRepository.findOne({
            where: {
                user_id: payload.userId
            }
        })

        if (user == null){
            return new HttpException("User not found", 404);
        }
        
        if (user.user_role ==  UserRole.ADMIN){
            user =  null;
        }

        // Call add recipe business logic to create a new recipe 
        const new_recipe = await this.recipeService.addRecipe(user, payload.recipe)

        try{
            const recipe_component_list = await this.recipeComponentService.addRecipeComponent(new_recipe, payload.components)

            // If the user add recipe that is not official, calculate the nutrition info based on the recipe components
            if (user !== null){
                await this.recipeService.updateNutritionInfo(new_recipe, recipe_component_list)
            }

        } catch(e){
            return new HttpException(e.message, 400)
        }

        return new HttpException("Recipe added successfully", 200)
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
        @Query('recipeId') recipeId: string = null,
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
        @Query("search") search: string = null,
        @Query("cuisine") cuisineIds: string = "[]",
        @Query("dietary") dietaryIds: string = "[]",
        @Query("mealType") mealType: string = "[]",
        @Query("foodCategory") foodCategoryIds: string = "[]",
    ){

        try {
            // Decode the headers to get the user_id
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);
    
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
                search, 
                JSON.parse(cuisineIds), 
                JSON.parse(dietaryIds), 
                JSON.parse(foodCategoryIds),
                JSON.parse(mealType),
                pagination,
                recipeId
            )

            // Return the recipe list or recipe details based on the pagination
            if (page_number != 0 && page_size != 0){

                return {
                    data: recipes,
                    page_number,
                    page_size,
                    total_recipe,
                    totalPages: Math.ceil(total_recipe / page_size)
                }
            // If pagination is not required return the recipe list
            } else if( page_number == 0 && page_size == 0 && recipeId == null){ 
                return recipes;

            // If recipeId is provided return the recipe details with components info 
            }else {
                const recipe = recipes as Recipe;

                const recipe_component_list = await this.recipeComponentService.getRecipeComponents(recipe.id);
                return {
                    recipe: recipe,
                    components: recipe_component_list
                }
            }
        } catch (e) {
            return new HttpException(e.message, 400)
        }
        
    }


    /**
     *  This endpoint is used to get the recently added recipe list
     * @param headers  Authorization header
     * @param page      Page number
     * @param pageSize  Page size
     * @returns  return the recently added recipe list
     */
    @Get('get-recently-added-list')
    async getRecentlyAddedList(
        @Headers() headers: any, 
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
    ){
        // Get the page number and page size
        const page_number = page != undefined ? parseInt(page, 10) : 1;
        const page_size = pageSize != undefined ? parseInt(pageSize, 10) : 4;

        // Decode the headers to get the user_id
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        
        // Call the getRecentlyAddedList business logic to get the recently added recipe list
        const[recipe_list, total_recipe] = await this.recipeService.getRecentlyAddedList(decoded_headers, page_number, page_size);

        // Return the recently added recipe list with pagination info
        return {
            data: recipe_list,
            total_recipe,
            page_number,
            page_size,
            totalPages: Math.ceil(total_recipe / page_size)
        };

    }

    /**
     * Get recipe components based on the recipeId
     * @param recipeId Recipe ID to get the recipe components
     * @returns {ingridients: [], seasonings: []} List of components for the recipe
     */
    @Get('get-components')
    async getRecipeComponents(@Query("recipeId") recipeId: string){
        return await this.recipeComponentService.getRecipeComponents(recipeId)
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
