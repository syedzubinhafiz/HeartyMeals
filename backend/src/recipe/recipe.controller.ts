import { Body, Controller, Delete, Headers, HttpException, Post } from '@nestjs/common';
import { AddRecipeDTO } from './dto/add-recipe-dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserRole } from 'src/user/enum/user-role.enum';
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

    @Delete('delete')
    async deleteRecipe(@Headers() headers: any, @Body('recipeId') recipeId: string) {
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);
    
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                await this.recipeService.deleteRecipe(decodedHeaders, recipeId, transactionalEntityManager);
                const recipeComponents = await this.recipeComponentService.deleteRecipeComponent(recipeId, transactionalEntityManager);
                await this.recipeComponentArchiveService.addToArchive(recipeComponents, transactionalEntityManager);
            });
            return new HttpException("Recipe deleted successfully", 200);
        } catch (e) {
            console.error('Transaction failed:', e);
            throw new HttpException(e.message, 400);
        }
    }
    
}
