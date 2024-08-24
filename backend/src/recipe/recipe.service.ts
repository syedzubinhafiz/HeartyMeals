import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RecipeDTO } from './dto/recipe-dto';
import { Recipe } from './recipe.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Visibility } from './enum/visibility.enum';
import { UserRole } from 'src/user/enum/user-role.enum';

@Injectable()
export class RecipeService {

    constructor( 
        @InjectRepository(Cuisine)
        private cuisineRepository: Repository<Cuisine>,
        @InjectRepository(Dietary)
        private dietaryRepository: Repository<Dietary>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

   
    public async addRecipe(decoded, recipeDTO: RecipeDTO, transactionalEntityManager: EntityManager): Promise<Recipe> {
        let user = await this.userRepository.findOne({
            where: {
                user_id: decoded['sub']
            }
        });

        if (user.user_role == UserRole.ADMIN) {
            user = null;
        }

        const new_recipe = new Recipe();

        const cuisine_type = await this.cuisineRepository.findOne({
            where: {
                id: recipeDTO.cuisineId
            }
        });

        const dietary_type = await this.dietaryRepository.findOne({
            where: {
                id: recipeDTO.dietaryId
            }
        });

        new_recipe.name = recipeDTO.name;
        new_recipe.description = recipeDTO.description;
        new_recipe.instruction = recipeDTO.instruction;
        new_recipe.serving_size = recipeDTO.servingSize;
        new_recipe.nutrition_info = recipeDTO.nutritionInformation;
        new_recipe.recommended_meal_time = recipeDTO.mealTimeRecommendation;
        new_recipe.user = user;
        new_recipe.cuisine = cuisine_type;
        new_recipe.dietary = dietary_type;
        new_recipe.preparation_time = recipeDTO.preparationTime;

        if (user == null) {
            new_recipe.visibility = Visibility.PUBLIC;
            new_recipe.is_approved = true;
        }

        // TODO: Add image upload logic here
        console.log(new_recipe);
        return await transactionalEntityManager.save(new_recipe);
    }
    
    
    
}
