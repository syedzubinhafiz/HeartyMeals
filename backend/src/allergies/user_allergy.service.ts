import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { UserAllergy } from "./user_allergy.entity";
import { FoodCategory } from "src/food-category/foodCategory.entity";

@Injectable()
export class UserAllergyService{
    constructor(
        @InjectRepository(UserAllergy)
        private userAllergyRepository: Repository<UserAllergy>,
    ){}

    async createNewUserAllergy(user: User, foodCat: FoodCategory){
        const new_user_allergy = new UserAllergy();
        new_user_allergy.user_id = user.user_id;
        new_user_allergy.food_cat_id = foodCat.id;

        return await this.userAllergyRepository.save(new_user_allergy);
    }
}