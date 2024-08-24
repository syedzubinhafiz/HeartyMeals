import { Body, Controller, Headers, HttpException, Post } from '@nestjs/common';
import { AddRecipeDTO } from './dto/add-recipe-dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { EntityManager, getManager, Repository } from 'typeorm';
import { RecipeService } from './recipe.service';
import { RecipeComponentService } from '../recipe-component/recipe-component.service';
import { CommonService } from 'src/common/common.service';

@Controller('recipe')
export class RecipeController {
    constructor(
        private readonly recipeService: RecipeService,
        private readonly recipeComponentService: RecipeComponentService,
        private readonly commonService: CommonService,
        @InjectEntityManager() private readonly entityManager: EntityManager
    ) {}

    @Post('add')
    async createRecipe(@Headers() header: any, @Body() payload: AddRecipeDTO) {
        const decoded = this.commonService.decodeHeaders(header.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const new_recipe = await this.recipeService.addRecipe(decoded, payload.recipe, transactionalEntityManager);
                await this.recipeComponentService.addRecipeComponent(new_recipe, payload.components, transactionalEntityManager);
            });
            return new HttpException("Recipe added successfully", 200);
        } catch (e) {
            console.error('Transaction failed:', e);
            throw new HttpException(e.message, 400);
        }
    }
}


