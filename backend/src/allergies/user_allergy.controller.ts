import { Controller, Post } from "@nestjs/common";
import { UserAllergyService } from "./user_allergy.service";

@Controller('user_allergy')
export class UserAllergyController {
    constructor(
        private userAllergyService: UserAllergyService
    ){}

    @Post()
    async createNewUserAllergy(){
        
    }
}