import { Controller } from "@nestjs/common";
import { UserAllergyService } from "./user_allergy.service";

@Controller('user')
export class UserAllergyController {
    constructor(
        private userAllergyService: UserAllergyService
    ){}
}