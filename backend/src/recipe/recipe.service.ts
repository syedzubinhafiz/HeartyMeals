import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RecipeDTO } from './dto/recipe-dto';
import { Recipe } from './recipe.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Visibility } from './enum/visibility.enum';
import { UserAllergy } from 'src/allergy/user_allergy.entity';
import { RecipeComponent } from 'src/recipe-component/recipe-component.entity';
import { NutritionInfoDTO } from './dto/nutrition-info-dto';
import { UserRole } from 'src/user/enum/user-role.enum';
import { RecipeOfTheDay } from './recipe-of-the-day.entity';
import { storage } from 'firebase-admin';

@Injectable()
export class RecipeService {

    constructor( 
        @InjectRepository(Cuisine)
        private cuisineRepository: Repository<Cuisine>,
        @InjectRepository(Dietary)
        private dietaryRepository: Repository<Dietary>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserAllergy)
        private userAllergyRepository: Repository<UserAllergy>,
        @InjectRepository(RecipeComponent)
        private recipeComponentRepository: Repository<RecipeComponent>,
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,
        @InjectRepository(RecipeOfTheDay)
        private recipeOfTheDayRepository: Repository<RecipeOfTheDay>

    ){}

    /**
     *  This function adds a new recipe to the database
     * @param user user
     * @param recipeDTO 
     * @returns 
     */
   
    public async addRecipe(decoded: any, recipeDTO: RecipeDTO, transactionalEntityManager: EntityManager): Promise<[Recipe, boolean]> {

        try{
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
            return [await transactionalEntityManager.save(new_recipe), is_custom];
        } catch (e) {
            throw new HttpException(e.message, 400);
        }
        
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
            .leftJoinAndSelect("recipe.user", "user")
            .select([
                'recipe.id', 
                'recipe.name', 
                'recipe.description', 
                'recipe.recommended_meal_time', 
                'recipe.is_approved', 
                'recipe.visibility', 
                'recipe.storage_links',
                'user.user_id'
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
            
            const [result, length] = await query.getManyAndCount();

            return [result, length]


        } else {
            //Get recipe based on recipeId
            const  recipe = await this.recipeRepository.findOne({
                where: {
                    id: recipeId
                }
            })

            if (recipe == null){
                throw new HttpException("Recipe not found", 400)
            }

            //Check if recipe belongs to the user
            if (recipe.user !== null  && recipe.user.user_id !==  decodedHeaders['sub']) {
                throw new HttpException("Recipe does not belong to user", 400)
            }


            if (recipe.visibility === Visibility.PRIVATE && recipe.user === null){
                throw new HttpException("Recipe is not available", 400)
            }

            return [recipe, 1]

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
         const [result, length] = await this.recipeRepository.createQueryBuilder("recipe")
         .leftJoinAndSelect("recipe.user", "user")
         .select([
            'recipe.id', 
            'recipe.name', 
            'recipe.description', 
            'recipe.recommended_meal_time', 
            'recipe.is_approved', 
            'recipe.visibility', 
            'recipe.storage_links',
            'recipe.created_at',
            'user.user_id'
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
         .getManyAndCount();

         //Get all official recipes that is public and recipe that belongs to the user
         return [result, length]

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

    
    /**
     * This function is used to get the recipe of the day for the user. Each user will have a unique recipe of the day
     * @param decodedHeaders Access token containing user information
     * @returns Recipe of the day for the user
     */
    async getRecipeOfTheDay(decodedHeaders: any){

        const user =  await this.userRepository.findOneBy({
            user_id: decodedHeaders['sub']
        })

        if (user == null){
            throw new HttpException("User not found", 400)
        }

        // Get recipe of the day 
        let recipe_of_the_day = await this.recipeOfTheDayRepository.createQueryBuilder("recipe_of_the_day")
        .leftJoinAndSelect("recipe_of_the_day.user", "user")
        .leftJoinAndSelect("recipe_of_the_day.recipe", "recipe")
        .select()
        .where("recipe_of_the_day.user_id = :user_id", { user_id: decodedHeaders['sub'] })
        .getOne();
    
        if( recipe_of_the_day == null){
            //create new recipe of the day for the current user 
            recipe_of_the_day =  new RecipeOfTheDay();
            recipe_of_the_day.user = user;
            recipe_of_the_day.date = new Date();   
        }

        // Check if the date in entry is not the current date
        if (
            recipe_of_the_day.date.toISOString().split('T')[0] !== new Date().toISOString().split('T')[0] || 
            recipe_of_the_day.recipe === undefined
        ){
          
            // get user allergies 
            const user_allergy_food_category = await this.userAllergyRepository.createQueryBuilder("user_allergy")
            .select('user_allergy.food_cat_id')
            .where("user_allergy.user_id = :user_id", { user_id: decodedHeaders['sub'] })
            .getMany();

            // Get all food category ids that the user is allergic to
            const user_allergy_food_category_ids =  user_allergy_food_category.map( (allergy) => allergy.food_cat_id)

            //Get all official recipes that is public and recipe that belongs to the user
            const query = this.recipeRepository.createQueryBuilder("recipe")
            .leftJoinAndSelect("recipe.user", "user")
            .leftJoinAndSelect("recipe.dietary", "dietary")
            .select()
            .where("recipe.user_id IS NULL AND recipe.visibility = :visibility", { visibility: Visibility.PUBLIC})
            .andWhere(`
                NOT EXISTS (
                    SELECT 1 
                    FROM jsonb_array_elements_text(recipe.related_food_categories) AS category 
                    WHERE category::uuid = ANY(:user_allergy_food_category_ids::uuid[])
                )
            `, { user_allergy_food_category_ids });

            // If user has dietary restriction, filter out recipes that does not match the dietary restriction 
            if (user.dietary !== null){
                query.andWhere("recipe.dietary_id = :dietary_id", { dietary_id: user.dietary.id })
            };

            query.orderBy("RANDOM()")

            recipe_of_the_day.recipe = await query.getOne();
            recipe_of_the_day.date = new Date();
            this.recipeOfTheDayRepository.save(recipe_of_the_day);
        }
        
        return {
            id: recipe_of_the_day.recipe.id,
            name: recipe_of_the_day.recipe.name,
            description: recipe_of_the_day.recipe.description,
            nutrition_info: recipe_of_the_day.recipe.nutrition_info,
            storage_links: recipe_of_the_day.recipe.storage_links
        }
    } 
}
