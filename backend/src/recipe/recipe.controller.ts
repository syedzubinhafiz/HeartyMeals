import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AddRecipeDTO } from './dto/add-recipe-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/user/enum/user-role.enum';
import { RecipeService } from './recipe.service';
import { RecipeComponentService } from '../recipe-component/recipe-component.service';

@Controller('recipe')
export class RecipeController {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private recipeService: RecipeService,
        private recipeComponentService: RecipeComponentService,
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
}
