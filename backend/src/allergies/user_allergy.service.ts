import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAllergy } from "./user_allergy.entity";

@Injectable()
export class UserAllergyService{
    constructor(
        @InjectRepository(UserAllergy)
        private userAllergyRepository: Repository<UserAllergy>,
    ){}

    /**
     * Create a new user allergy record
     * @param user - user id
     * @param foodCategoryId - food category id
     * @returns newly created entry in database
     */
    async createNewUserAllergy(userId: string, foodCategoryId: string){
        const new_user_allergy = new UserAllergy();
        new_user_allergy.user_id = userId;
        new_user_allergy.food_cat_id = foodCategoryId;

        return await this.userAllergyRepository.save(new_user_allergy);
    }

    /**
     * Delete a user allergy record
     * @param userId - user id
     * @param foodCategoryId - food category id
     * @returns delete result
     */
    async deleteUserAllergy(userId: string, foodCategoryId: string){
        return await this.userAllergyRepository.delete({user_id: userId, food_cat_id: foodCategoryId});
    }

    /**
     * Get all allergies of a user
     * @param userId - user id
     * @returns an array of user allergies
     */
    async getUserAllergies(userId: string){
        return await this.userAllergyRepository.find({
            where: {
                user_id: userId
            }
        });
    }

    /**
     * Get all entries in the databaase
     * @returns all entries in the database
     */
    async getAllUserAllergies(){
        return await this.userAllergyRepository.find();
    }
}