import { Body, Controller, Post } from '@nestjs/common';
import { AddRecipeDTO } from './dto/add-recipe-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/user/enum/user-role.enum';
import { RecipeService } from './recipe.service';
import { RecipeComponentService } from './recipe-component/recipe-component.service';

@Controller('recipe')
export class RecipeController {

    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private recipeService: RecipeService,
        private recipeComponentService: RecipeComponentService,
    ){}
    
    @Post('add')
    async createRecipe(@Body() payload: AddRecipeDTO){

        // Get user from user 
        let user = await this.userRepo.findOne({
            where: {
                user_id: payload.user_id
            }
        })


        if (user.user_role ==  UserRole.ADMIN){
            user =  null;
        }


        // Call add recipe business logic to create a new recipe 
        const new_recipe = await this.recipeService.addRecipe(user, payload.recipe)


        if (await this.recipeComponentService.addRecipeComponent(new_recipe, payload.components)) {
            return "Recipe Successfully save"
        } else {
            return "Error"
        }
    }
}
