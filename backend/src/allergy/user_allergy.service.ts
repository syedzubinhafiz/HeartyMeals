import { HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { UserAllergy } from "./user_allergy.entity";
import { UserService } from "src/user/user.service";
import { FoodCategory } from "src/food-category/foodCategory.entity";
import { User } from "src/user/user.entity";

@Injectable()
export class UserAllergyService{
    constructor(
        @InjectRepository(UserAllergy)
        private userAllergyRepository: Repository<UserAllergy>,
        @InjectRepository(FoodCategory)
        private foodCategoryRepository: Repository<FoodCategory>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private userService: UserService,
    ){}

    /**
     * Create a new user allergy record
     * @param decodedHeaders - decoded headers from the request
     * @param foodCategoryIds - array of food category id
     * @returns true if entry is successfully saved in database, else return an error
     */
    async createNewUserAllergy(decodedHeaders: any, foodCategoryIds: string[]){
        var all_entries = [];

        // user id validation
        if (!this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with id ${decodedHeaders['sub']} not found.`, 400); }

        const user_object = await this.userRepository.findOneBy({user_id: decodedHeaders['sub']});

        // food category id validation
        const food_category_objects = await this.foodCategoryRepository.findBy({
            id: In(foodCategoryIds),
       });

       const food_category_map = new Map(food_category_objects.map(food_category => [food_category.id, food_category]));

        try {
            // Use Promise.all to ensure all promises are resolved before proceeding with saving the entries
            const results = await Promise.all(foodCategoryIds.map(async id => {
                // Validate recipeId
                const food_category = food_category_map.get(id);
                if (!food_category) {
                    throw new Error(`Food category with id ${id} not found.`);
                }

                const user_allergy = await this.userAllergyRepository.createQueryBuilder('user_allergy')
                .where('user_id = :user_id', {user_id: decodedHeaders['sub']})
                .andWhere('food_cat_id = :food_cat_id', {food_cat_id: id})
                .getOne();
                // only add the ones that do not exist in the database
                if (!user_allergy || user_allergy == null){
                    // Create entries to store in saved_entries
                    const new_user_allergy = new UserAllergy();
                    new_user_allergy.user = user_object;
                    new_user_allergy.foodCategory = food_category;
                    
                    all_entries.push(new_user_allergy)
                }

            }));

            await this.userAllergyRepository.save(all_entries);
            return true;

        } catch (e) {
            throw e;
        }
    }

    /**
     * Delete a user allergy record
     * @param decodedHeaders - decoded headers from the request
     * @param foodCategoryIds - array of food category id
     * @returns delete result
     */
    async deleteUserAllergy(decodedHeaders: any, foodCategoryIds: string[]){
        var all_entries = [];
        // user id validation
        if (!this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with id ${decodedHeaders['sub']} not found.`, 400); }

         // food category id validation
         const food_category_objects = await this.foodCategoryRepository.findBy({
            id: In(foodCategoryIds),
       });

       const food_category_map = new Map(food_category_objects.map(food_category => [food_category.id, food_category]));

       try {
            // Use Promise.all to ensure all promises are resolved before proceeding with saving the entries
            const results = await Promise.all(foodCategoryIds.map(async id => {
                // Validate recipeId
                const food_category = food_category_map.get(id);
                if (!food_category) {
                    throw new Error(`Food category with id ${id} not found.`);
                }

                // entry validation
                var user_allergy = await this.userAllergyRepository.createQueryBuilder('user_allergy')
                    .where('user_id = :user_id', {user_id: decodedHeaders['sub']})
                    .andWhere('food_cat_id = :food_cat_id', {food_cat_id: id})
                    .getOne() 
                // only add the ones that do not exist in the database
                if (user_allergy){
                    all_entries.push(user_allergy)
                }
                else {
                    throw new Error(`User allergy with user id ${decodedHeaders['sub']} and food category id ${id} not found.`);
                }

            }));

            await this.userAllergyRepository.delete(all_entries);
            return true;

        } catch (e) {
            throw e;
        }        
    }

    /**
     * Get all allergies of a user
     * @param decodedHeaders - decoded headers from the request
     * @returns an array of user allergies
     */
    async getUserAllergies(decodedHeaders: any){
        // user id validation
        if (!this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with id ${decodedHeaders['sub']} not found.`, 400); }

        try {
            return await this.userAllergyRepository.createQueryBuilder('user_allergy')
                .where('user_id = :user_id', {user_id: decodedHeaders['sub']})
                .getMany();
        } catch (e) {
            return new HttpException(`Error fetching user allergies with uesr id ${decodedHeaders['sub']}`, 400);
        }
    }

    /**
     * Get all entries in the databaase
     * @returns all entries in the database
     */
    async getAllUserAllergies(){
        try {
            return await this.userAllergyRepository.find();
        } catch (e) {
            return new HttpException("Error fetching all user allergies", 400);
        }
    }
}