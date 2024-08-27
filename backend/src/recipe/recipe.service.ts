import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RecipeDTO } from './dto/recipe-dto';
import { Recipe } from './recipe.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Visibility } from './enum/visibility.enum';
import { RecipeComponent } from 'src/recipe-component/recipe-component.entity';
import { NutritionInfoDTO } from './dto/nutrition-info-dto';
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
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,
    ){}

    /**
     *  This function adds a new recipe to the database
     * @param user user
     * @param recipeDTO 
     * @returns 
     */
   
    public async addRecipe(decoded, recipeDTO: RecipeDTO, transactionalEntityManager: EntityManager): Promise<[Recipe, boolean]> {

        let is_custom = true;
        let user = await this.userRepository.findOne({
            where: {
                user_id: decoded['sub']
            }
        });

        if (user == null) {
            throw new Error("User not found");
        }

        if (user.user_role == UserRole.ADMIN) {
            user = null;
            is_custom = false;
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
        return [await transactionalEntityManager.save(new_recipe), is_custom];
    }

    /**
     * This function updates the nutrition info of a recipe
     * @param recipe  recipe to update
     * @param recipeComponentList list of recipe components that make up the recipe
     */
    async updateNutritionInfo(recipe: Recipe, recipeComponentList: RecipeComponent[], transactionalEntityManager: EntityManager){

        // Calculate the total nutrition info of the recipe
        const totalNutritionInfo = this.calculateTotalNutritionInfo(recipeComponentList);

        // Update the recipe with the new nutrition info
        recipe.nutrition_info = totalNutritionInfo;

        // Save the updated recipe
        await transactionalEntityManager.save(recipe);
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
            result.addedSugars += multiplier * recipeComponent.component.nutrition_info.addedSugars;
            result.biotin += multiplier * recipeComponent.component.nutrition_info.biotin;
            result.calcium += multiplier * recipeComponent.component.nutrition_info.calcium;
            result.chloride += multiplier * recipeComponent.component.nutrition_info.chloride;
            result.cholesterol += multiplier * recipeComponent.component.nutrition_info.chloride;
            result.chromium += multiplier * recipeComponent.component.nutrition_info.chromium;
            result.copper += multiplier * recipeComponent.component.nutrition_info.copper;
            result.dietaryFiber += multiplier * recipeComponent.component.nutrition_info.dietaryFiber;
            result.fat += multiplier * recipeComponent.component.nutrition_info.fat;
            result.folate += multiplier * recipeComponent.component.nutrition_info.folate;
            result.iodine += multiplier * recipeComponent.component.nutrition_info.iodine;
            result.iron += multiplier * recipeComponent.component.nutrition_info.iron;
            result.magnesium += multiplier * recipeComponent.component.nutrition_info.magnesium;
            result.manganese += multiplier * recipeComponent.component.nutrition_info.manganese;
            result.molybdenum += multiplier * recipeComponent.component.nutrition_info.molybdenum;
            result.niacin += multiplier * recipeComponent.component.nutrition_info.niacin;
            result.pantothenicAcid += multiplier * recipeComponent.component.nutrition_info.pantothenicAcid;
            result.phosphorus += multiplier * recipeComponent.component.nutrition_info.phosphorus;
            result.potassium += multiplier * recipeComponent.component.nutrition_info.potassium;
            result.protein += multiplier * recipeComponent.component.nutrition_info.protein;
            result.riboflavin += multiplier * recipeComponent.component.nutrition_info.riboflavin;
            result.saturatedFat += multiplier * recipeComponent.component.nutrition_info.saturatedFat;
            result.selenium += multiplier * recipeComponent.component.nutrition_info.selenium;
            result.sodium += multiplier * recipeComponent.component.nutrition_info.sodium;
            result.thiamin += multiplier * recipeComponent.component.nutrition_info.thiamin;
            result.totalCarbohydrate += multiplier * recipeComponent.component.nutrition_info.totalCarbohydrate;
            result.vitaminA += multiplier * recipeComponent.component.nutrition_info.vitaminA;
            result.vitaminB6 += multiplier * recipeComponent.component.nutrition_info.vitaminB6;
            result.vitaminB12 += multiplier * recipeComponent.component.nutrition_info.vitaminB12;
            result.vitaminC += multiplier * recipeComponent.component.nutrition_info.vitaminC;
            result.vitaminD += multiplier * recipeComponent.component.nutrition_info.vitaminD;
            result.vitaminE += multiplier * recipeComponent.component.nutrition_info.vitaminE;
            result.vitaminK += multiplier * recipeComponent.component.nutrition_info.vitaminK;
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
