import { Body, Controller, HttpException, Inject, Post } from "@nestjs/common";
import { UserAllergyService } from "./user_allergy.service";
import { CreateUserAllergyDTO } from "./dto/create-user-allergy-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { FoodCategory } from "src/food-category/foodCategory.entity";

@Controller('user_allergy')
export class UserAllergyController {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(FoodCategory)
        private foodCategoryRepository: Repository<FoodCategory>,
        private userAllergyService: UserAllergyService
    ){}

    @Post()
    async createNewUserAllergy(@Body() payload: CreateUserAllergyDTO){
        var user = await this.userRepository.findOne({
            where: {
                user_id: payload.userId
            }
        });
        var food_cat = await this.foodCategoryRepository.findOne({
            where: {
                id: payload.foodCatId
            }
        });
        try {
            await this.userAllergyService.createNewUserAllergy(user, food_cat);
        }
        catch (e) {
            return new HttpException(e.message, 400);
        }

        return new HttpException("User allergy added successfully", 200);
        
    }
}