import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RecipeDTO } from './dto/recipe-dto';
import { Recipe } from './recipe.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Visibility } from './enum/visibility.enum';

@Injectable()
export class RecipeService {

    constructor( 
        @InjectRepository(Cuisine)
        private cuisineRepository: Repository<Cuisine>,
        @InjectRepository(Dietary)
        private dietaryRepository: Repository<Dietary>,
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>
    ){}

    async addRecipe(user: User|null, recipeDTO: RecipeDTO){

        const new_recipe =  new Recipe();

        const cuisine_type = await this.cuisineRepository.findOne({
            where: {
                id: recipeDTO.cuisineId
            }
        });

        const dietary_type =  await this.dietaryRepository.findOne({
            where: {
                id: recipeDTO.dietaryId
            }
        });

        new_recipe.name =  recipeDTO.name;
        new_recipe.description = recipeDTO.description;
        new_recipe.instruction = recipeDTO.instruction;
        new_recipe.serving_size = recipeDTO.servingSize;
        new_recipe.nutrition_info = recipeDTO.nutritionInformation;
        new_recipe.recommended_meal_time =  recipeDTO.mealTimeRecommendation;
        new_recipe.user = user;
        new_recipe.cuisine = cuisine_type;
        new_recipe.dietary = dietary_type

        if (user == null){
            new_recipe.visibility = Visibility.PUBLIC
            new_recipe.is_approved =  true
        }

        //TODO: Add image upload logic here
        
       return await this.recipeRepository.save(new_recipe)
    }

    async deleteRecipe(decodedHeaders: any, recipeId: string){

        //Check if recipe exist 
        const recipe = await this.recipeRepository.findOne({
            where: {
                id: recipeId
            }
        })
        
        if (recipe == null){
            return new HttpException("Recipe not found", 404);
        }
        
        //Check if user is authorized to delete recipe
        if (recipe.user.user_id !== decodedHeaders['sub']){
            return new HttpException("Unauthorized", 401);
        }

        // Soft delete recipe
        recipe.deleted_at = new Date();
        try{
            await this.recipeRepository.save(recipe);
        } catch(e){
            return new HttpException(e.message, 400);
        } finally {
            return new HttpException("Recipe deleted successfully", 200);
        }
    } 
}
