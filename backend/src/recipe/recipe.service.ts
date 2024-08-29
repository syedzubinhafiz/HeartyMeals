import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RecipeDTO } from './dto/recipe-dto';
import { Recipe } from './recipe.entity';
import { EntityManager, Repository } from 'typeorm';
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

    /**
     *  This function adds a new recipe to the database
     * @param user user
     * @param recipeDTO 
     * @returns 
     */
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

    public async deleteRecipe(decodedHeaders: any, recipeId: string, transactionalEntityManager: EntityManager){

        //Check if recipe exist 
        const recipe = await this.recipeRepository.findOne({
            where: {
                id: recipeId
            }
        })
        
        if (recipe == null){
            throw new Error("Recipe not found");
        }

        //Check if user is authorized to delete recipe
        if (recipe.user !== null){
            if (recipe.user.user_id !== decodedHeaders['sub']) {
                throw new Error("Unauthorized");
            }
        }

        // Soft delete recipe
        recipe.deleted_at = new Date();
        try{
            await transactionalEntityManager.save(recipe);
            return recipe.id;
        } catch(e){
            throw new Error("Error deleting recipe")
        }
    } 
}
