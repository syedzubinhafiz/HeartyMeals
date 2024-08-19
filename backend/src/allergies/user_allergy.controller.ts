import { Body, Controller, Get, HttpException, Inject, Post } from "@nestjs/common";
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

    @Post('add')
    async createNewUserAllergy(@Body() payload: CreateUserAllergyDTO){
        // validation if user exists
        var user = await this.userRepository.findOne({
            where: {
                user_id: payload.userId
            }
        });
        if (user == null){
            return "User does not exist in database.";
        }

        // validation if food category exists
        var food_category = await this.foodCategoryRepository.findOne({
            where: {
                type: payload.foodCatName
            }
        });

        if (food_category == null){
            return "Food category does not exist in database."
        }

        try {
            await this.userAllergyService.createNewUserAllergy(user.user_id, food_category.id);
        }
        catch (e) {
            return new HttpException(e.message, 400);
        }

        return new HttpException("User allergy added successfully", 200);
        
    }

    @Post('delete')
    async deleteUserAllergy(@Body() payload: CreateUserAllergyDTO){
        // validation if user exists
        var user = await this.userRepository.findOne({
            where: {
                user_id: payload.userId
            }
        });
        if (user == null){
            return "User does not exist in database.";
        }

        // validation if food category exists
        var food_category = await this.foodCategoryRepository.findOne({
            where: {
                type: payload.foodCatName
            }
        });

        if (food_category == null){
            return "Food category does not exist in database."
        }

        try {
            await this.userAllergyService.createNewUserAllergy(user.user_id, food_category.id);
        }
        catch (e) {
            return new HttpException(e.message, 400);
        }

        return new HttpException("User allergy added successfully", 200);
        
    }

    @Get()
    async getUserAllergies(@Body("userId") payload){
        // validation if user exists
        var user = await this.userRepository.findOne({
            where: {
                user_id: payload.userId
            }
        });
        if (user == null){
            return "User does not exist in database.";
        }

        return await this.userAllergyService.getUserAllergies(payload.userId);
    }

    @Get()
    async getAllUserAllergies(){
        return await this.userAllergyService.getAllUserAllergies();
    }
}