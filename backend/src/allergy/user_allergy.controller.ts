import { Body, Controller, Delete, Get, Headers, HttpException, Inject, Post } from "@nestjs/common";
import { UserAllergyService } from "./user_allergy.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { FoodCategory } from "src/food-category/foodCategory.entity";
import { CommonService } from "src/common/common.service";

@Controller('user_allergy')
export class UserAllergyController {
    constructor(
        private commonService: CommonService,
        private userAllergyService: UserAllergyService
    ){}

    @Post('add')
    async createNewUserAllergy(@Headers() headers: any, @Body("foodCatIds") payload: string[]){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            await this.userAllergyService.createNewUserAllergy(decoded_headers, payload);
        }
        catch (e) {
            return new HttpException(e.message, 400);
        }

        return new HttpException("User allergy added successfully", 200);
        
    }

    @Delete('delete')
    async deleteUserAllergy(@Headers() headers: any, @Body("foodCatIds") payload: string[]){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            await this.userAllergyService.deleteUserAllergy(decoded_headers, payload);
        }
        catch (e) {
            return new HttpException(e.message, 400);
        }

        return new HttpException("User allergy deleted successfully", 200);
        
    }

    @Get('get/user')
    async getUserAllergies(@Headers() headers: any){
        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);
        try {
            return await this.userAllergyService.getUserAllergies(decoded_headers);
        } catch (e) {
            return new HttpException(e.message, 400);
        }
    }

    @Get('get/all')
    async getAllUserAllergies(){
        return await this.userAllergyService.getAllUserAllergies();
    }
}