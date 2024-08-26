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

    @Get('get-official')
    async getOfficialRecipes(){
        return await this.recipeService.getOfficialRecipe()
    }

    @Get('get')
    async getRecipe(@Headers() headers: any, @Body('recipeId') recipeId: string = null){

        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);
        return await this.recipeService.getRecipe(decodedHeaders, recipeId)
    }

}
