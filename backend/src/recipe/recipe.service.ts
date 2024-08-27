import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RecipeDTO } from './dto/recipe-dto';
import { Recipe } from './recipe.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Visibility } from './enum/visibility.enum';
import { RecipeComponent } from 'src/recipe-component/recipe-component.entity';
import { NutritionInfoDTO } from './dto/nutrition-info-dto';

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
        new_recipe.nutrition_info =  recipeDTO.nutritionInformation;
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

    /**
     * This function updates the nutrition info of a recipe
     * @param recipe  recipe to update
     * @param recipeComponentList list of recipe components that make up the recipe
     */
    async updateNutritionInfo(recipe: Recipe, recipeComponentList: RecipeComponent[]){

        // Calculate the total nutrition info of the recipe
        const totalNutritionInfo = this.calculateTotalNutritionInfo(recipeComponentList);

        // Update the recipe with the new nutrition info
        recipe.nutrition_info = totalNutritionInfo;

        // Save the updated recipe
        await this.recipeRepository.save(recipe);
    }
    
    /**
     *  This function calculates the total nutrition info of a recipe based on the recipe components
     * @param recipeComponentList list of recipe components that make up the recipe
     * @returns total nutrition info of the recipe
     */
    private calculateTotalNutritionInfo(recipeComponentList: RecipeComponent[]): NutritionInfoDTO{
        
        let result =  new NutritionInfoDTO();

        // Loop through all recipe components and calculate the total nutrition info
        recipeComponentList.forEach((recipeComponent) => {
            const multiplier =  recipeComponent.amount / recipeComponent.component.amount;

            result.calories += multiplier * recipeComponent.component.nutrition_info.calories;
            result.added_sugars += multiplier * recipeComponent.component.nutrition_info.added_sugars;
            result.biotin += multiplier * recipeComponent.component.nutrition_info.biotin;
            result.calcium += multiplier * recipeComponent.component.nutrition_info.calcium;
            result.chloride += multiplier * recipeComponent.component.nutrition_info.chloride;
            result.cholesterol += multiplier * recipeComponent.component.nutrition_info.chloride;
            result.chromium += multiplier * recipeComponent.component.nutrition_info.chromium;
            result.copper += multiplier * recipeComponent.component.nutrition_info.copper;
            result.dietarty_fiber += multiplier * recipeComponent.component.nutrition_info.dietarty_fiber;
            result.fat += multiplier * recipeComponent.component.nutrition_info.fat;
            result.folate += multiplier * recipeComponent.component.nutrition_info.folate;
            result.iodine += multiplier * recipeComponent.component.nutrition_info.iodine;
            result.iron += multiplier * recipeComponent.component.nutrition_info.iron;
            result.magnesium += multiplier * recipeComponent.component.nutrition_info.magnesium;
            result.manganese += multiplier * recipeComponent.component.nutrition_info.manganese;
            result.molybdenum += multiplier * recipeComponent.component.nutrition_info.molybdenum;
            result.niacin += multiplier * recipeComponent.component.nutrition_info.niacin;
            result.pantothenic_acid += multiplier * recipeComponent.component.nutrition_info.pantothenic_acid;
            result.phosphorus += multiplier * recipeComponent.component.nutrition_info.phosphorus;
            result.potassium += multiplier * recipeComponent.component.nutrition_info.potassium;
            result.protein += multiplier * recipeComponent.component.nutrition_info.protein;
            result.riboflavin += multiplier * recipeComponent.component.nutrition_info.riboflavin;
            result.saturated_fat += multiplier * recipeComponent.component.nutrition_info.saturated_fat;
            result.selenium += multiplier * recipeComponent.component.nutrition_info.selenium;
            result.sodium += multiplier * recipeComponent.component.nutrition_info.sodium;
            result.thiamin += multiplier * recipeComponent.component.nutrition_info.thiamin;
            result.total_carbohydrate += multiplier * recipeComponent.component.nutrition_info.total_carbohydrate;
            result.vitamin_a += multiplier * recipeComponent.component.nutrition_info.vitamin_a;
            result.vitamin_b6 += multiplier * recipeComponent.component.nutrition_info.vitamin_b6;
            result.vitamin_b12 += multiplier * recipeComponent.component.nutrition_info.vitamin_b12;
            result.vitamin_c += multiplier * recipeComponent.component.nutrition_info.vitamin_c;
            result.vitamin_d += multiplier * recipeComponent.component.nutrition_info.vitamin_d;
            result.vitamin_e += multiplier * recipeComponent.component.nutrition_info.vitamin_e;
            result.vitamin_k += multiplier * recipeComponent.component.nutrition_info.vitamin_k;
            result.zinc += multiplier * recipeComponent.component.nutrition_info.zinc;
        });

        return result;
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
        if (recipe.user !== undefined){
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
