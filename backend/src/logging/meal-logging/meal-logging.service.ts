import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogging } from "./meal-logging.entity";
import { Repository } from "typeorm";

@Injectable()
export class MealLoggingService {
    constructor(
        @InjectRepository(MealLogging)
        private mealLoggingRepository: Repository<MealLogging>,
    ){}

    async addMealLogging(){
        
    }
}