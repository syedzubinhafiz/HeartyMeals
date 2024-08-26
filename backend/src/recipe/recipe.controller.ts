import { Body, Controller, Get, Headers, HttpException, Post } from '@nestjs/common';
import { AddRecipeDTO } from './dto/add-recipe-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/user/enum/user-role.enum';
import { RecipeService } from './recipe.service';
import { RecipeComponentService } from 'src/recipe-component/recipe-component.service';
import { CommonService } from 'src/common/common.service';


@Controller('recipe')
export class RecipeController {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private recipeService: RecipeService,
        private recipeComponentService: RecipeComponentService,
        private commonService: CommonService,
    ){}
    
    @Post('add')
    async createRecipe(@Body() payload: AddRecipeDTO){

        // Get user from user 
        let user = await this.userRepository.findOne({
            where: {
                user_id: payload.userId
            }
        })
        
        if (user.user_role ==  UserRole.ADMIN){
            user =  null;
        }

        // Call add recipe business logic to create a new recipe 
        const new_recipe = await this.recipeService.addRecipe(user, payload.recipe)

        try{
            await this.recipeComponentService.addRecipeComponent(new_recipe, payload.components)
        } catch(e){
            return new HttpException(e.message, 400)
        }

        return new HttpException("Recipe added successfully", 200)
    }

    /**
     * Endpoint to get all official recipes
     * @returns List of official recipes
     */
    @Get('get-official')
    async getOfficialRecipes(){
        return await this.recipeService.getOfficialRecipe()
    }

    /**
     * Endpoint to get all official recipes and recipes created by the user
     * @param headers Authorization header
     * @returns List of user recipes
     */
    @Get('get')
    async getRecipe(@Headers() headers: any, @Body('recipeId') recipeId: string = null){

        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);
        return await this.recipeService.getRecipe(decoded_headers, recipeId)
    }


    /**
     * Get recipe components based on the recipeId
     * @param recipeId Recipe ID to get the recipe components
     * @returns {ingridients: [], seasonings: []} List of components for the recipe
     */
    @Get('get-components')
    async getRecipeComponents(@Body("recipeId") recipeId: string){

        try{

            return await this.recipeComponentService.getRecipeComponents(recipeId)

        } catch(e) {
            return new HttpException(e.message, 400)
        }
    }

}
