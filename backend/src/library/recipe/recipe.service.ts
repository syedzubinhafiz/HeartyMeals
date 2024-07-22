import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RecipeDTO } from './dto/recipe-dto';
import { Recipe } from './recipe.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entitry';
import { Visibility } from './visibility.enum';

@Injectable()
export class RecipeService {

    constructor( 
        @InjectRepository(Cuisine)
        private cuisineRepo: Repository<Cuisine>,
        @InjectRepository(Dietary)
        private dietaryRepo: Repository<Dietary>,
        @InjectRepository(Recipe)
        private recipeRepo: Repository<Recipe>
    ){}

    async addRecipe(user: User|null, recipeDTO: RecipeDTO){

        const newRecipe =  new Recipe();

        const cuisineType = await this.cuisineRepo.findOne({
            where: {
                id: recipeDTO.cuisine_id
            }
        });

        const dietaryType =  await this.dietaryRepo.findOne({
            where: {
                id: recipeDTO.dietary_id
            }
        });

        newRecipe.name =  recipeDTO.name;
        newRecipe.description = recipeDTO.description;
        newRecipe.instruction = recipeDTO.instruction;
        newRecipe.serving_size = recipeDTO.serving_size;
        newRecipe.nutrition_info = recipeDTO.nutrition_info;
        newRecipe.recommended_meal_time =  recipeDTO.recommended_meal_time;
        newRecipe.user = user;
        newRecipe.cuisine = cuisineType;
        newRecipe.dietary = dietaryType

        if (user == null){
            newRecipe.visibility = Visibility.PUBLIC
            newRecipe.is_approved =  true
        }
        
       return await this.recipeRepo.save(newRecipe)
    }
    
}
