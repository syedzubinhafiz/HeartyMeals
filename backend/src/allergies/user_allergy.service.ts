import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { UserAllergy } from "./user_allergy.entity";
import { FoodCategory } from "src/food-category/foodCategory.entity";

@Injectable()
export class UserAllergyService{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(FoodCategory)
        private foodCategoryRepository: Repository<FoodCategory>,
        @InjectRepository(UserAllergy)
        private userAllergyRepository: Repository<UserAllergy>,
    ){}

    async createNewUserAllergy(){}
}