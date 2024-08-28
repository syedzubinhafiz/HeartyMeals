import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RecipeDTO } from './dto/recipe-dto';
import { Recipe } from './recipe.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Visibility } from './enum/visibility.enum';
import { UserAllergy } from 'src/allergy/user_allergy.entity';
import { RecipeComponent } from 'src/recipe-component/recipe-component.entity';

@Injectable()
export class RecipeService {

    constructor( 
        @InjectRepository(Cuisine)
        private cuisineRepository: Repository<Cuisine>,
        @InjectRepository(Dietary)
        private dietaryRepository: Repository<Dietary>,
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,
        @InjectRepository(UserAllergy)
        private userAllergyRepository: Repository<UserAllergy>,
        @InjectRepository(RecipeComponent)
        private recipeComponentRepository: Repository<RecipeComponent>

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


    /**
     *  This function is used to get the recipe based on the search criteria
     * @param decodedHeaders  Access token containing user information
     * @param page  Page number
     * @param pageSize  Page size
     * @param search  Search string
     * @param cuisineIds  filter by cuisine ids
     * @param dietaryIds  filter by dietary ids
     * @param foodCategoryIds  filter by food category ids
     * @param mealTypes  filter by meal type
     * @param pagination Pagination flag
     * @param recipeId  Recipe ID to get the recipe details (optional)
     * @returns  Recipe list based on the search criteria or recipe details based on the recipeId
     */
    async getRecipe(
        decodedHeaders: any, 
        page: number, 
        pageSize:number,
        search: string|null,
        cuisineIds: string[],
        dietaryIds: string[],
        foodCategoryIds: string[],
        mealTypes: string[], 
        pagination: boolean = true,
        recipeId: string = null
    ): Promise<[Recipe[]|Recipe, number]>{

        // Calculate the number of items to skip
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        

        // get user prefered dietary
        if (recipeId == null){        

            // get user allergies 
            const user_allergy_food_category = await this.userAllergyRepository.createQueryBuilder("user_allergy")
            .select('user_allergy.food_cat_id')
            .where("user_allergy.user_id = :user_id", { user_id: decodedHeaders['sub'] })
            .getMany();

            // Get all food category ids that the user is allergic to
            const user_allergy_food_category_ids =  user_allergy_food_category.map( (allergy) => allergy.food_cat_id)

            //Get all official recipes that is public and recipe that belongs to the user
            const query = this.recipeRepository.createQueryBuilder("recipe")
            .select([
                'recipe.id', 
                'recipe.name', 
                'recipe.description', 
                'recipe.recommended_meal_time', 
                'recipe.is_approved', 
                'recipe.visibility', 
                'recipe.storage_links'
            ])
            .where(
                new Brackets((qb) => {
                    qb.where("recipe.user_id IS NULL AND recipe.visibility = :visibility", { visibility: Visibility.PUBLIC })
                      .orWhere("recipe.user_id = :user_id", { user_id: decodedHeaders['sub'] });
                }))
            .andWhere(`
                NOT EXISTS (
                    SELECT 1 
                    FROM jsonb_array_elements_text(recipe.related_food_categories) AS category 
                    WHERE category::uuid = ANY(:user_allergy_food_category_ids::uuid[])
                )
            `, { user_allergy_food_category_ids });
        
            
            // Get user selected cuisine
            if (cuisineIds.length > 0){
                query.andWhere("recipe.cuisine_id IN (:...ids)", {ids:cuisineIds })
            }

            // Get user selected dietary
            if (dietaryIds.length > 0){
                query.andWhere("recipe.dietary_id IN (:...dietaryIds)", { dietaryIds })
            }

            // Get user selected food category
            if (foodCategoryIds.length > 0){
                query.andWhere("recipe.related_food_categories && ARRAY[:...foodCategoryIds]::text[]", { foodCategoryIds })
            }

            // Get user selected meal type
            if (mealTypes.length > 0) {
                query.andWhere(
                    mealTypes.map(meal => `recipe.recommended_meal_time->>'${meal}' = 'true'`).join(' AND ')
                );
            }
            
            // Search for recipe
            if (search != null){
                query.andWhere("recipe.name ILIKE :search OR recipe.description ILIKE :search", { search: `%${search}%` })
            }

            // Pagination
            if (pagination){
                query.skip(skip)
                .take(take)
            };
            
            const result = await query.getMany();

            return [result, result.length]


        } else {
            //Get recipe based on recipeId
            const  recipe = await this.recipeRepository.findOne({
                where: {
                    id: recipeId
                }
            })

            //Check if recipe belongs to the user
            if (recipe.user !== null  && recipe.user.user_id !==  decodedHeaders['sub']) {
                throw new HttpException("Recipe does not belong to user", 400)
            } else {
                return [recipe, 1];
            }


        }
    }
    

    /**
     * This function is used to get the recently added recipes
     * @param decodedHeaders  Access token containing user information
     * @param page  Page number
     * @param pageSize  Page size
     * @returns List of recently added recipes
     */
    async getRecentlyAddedList(
        decodedHeaders: any, 
        page: number, 
        pageSize: number
    ):Promise<[Recipe[], number]>{

        // Calculate the number of items to skip
        const skip = (page - 1) * pageSize;

         // get user allergies 
         const user_allergy_food_category = await this.userAllergyRepository.createQueryBuilder("user_allergy")
         .select('user_allergy.food_cat_id')
         .where("user_allergy.user_id = :user_id", { user_id: decodedHeaders['sub'] })
         .getMany();

         // Get all food category ids that the user is allergic to
         const user_allergy_food_category_ids =  user_allergy_food_category.map( (allergy) => allergy.food_cat_id)

         //Get all official recipes that is public and recipe that belongs to the user 
         // filter out recipes that contains food categories that the user is allergic to
         //Sort the recipes by created_at in descending order
         const result = await this.recipeRepository.createQueryBuilder("recipe")
         .select([
            'recipe.id', 
            'recipe.name', 
            'recipe.description', 
            'recipe.recommended_meal_time', 
            'recipe.is_approved', 
            'recipe.visibility', 
            'recipe.storage_links'
        ])
         .where(
             new Brackets((qb) => {
                 qb.where("recipe.user_id IS NULL AND recipe.visibility = :visibility", { visibility: Visibility.PUBLIC })
                   .orWhere("recipe.user_id = :user_id", { user_id: decodedHeaders['sub'] });
             }))
         .andWhere(`
             NOT EXISTS (
                 SELECT 1 
                 FROM jsonb_array_elements_text(recipe.related_food_categories) AS category 
                 WHERE category::uuid = ANY(:user_allergy_food_category_ids::uuid[])
             )
         `, { user_allergy_food_category_ids })
         .orderBy("recipe.created_at", "DESC")
         .skip(skip)
         .take(pageSize)
         .getMany();

         //Get all official recipes that is public and recipe that belongs to the user
         return [result, result.length]

    }

}
