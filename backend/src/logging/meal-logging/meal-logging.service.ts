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

    async addMealLogging(userId, recipeId, mealType){
        
    }

    async getMealLogging(){}

    /**
     * Mark the meal consumed 
     * @param mealLoggingId - unique id of the meal
     * @returns true after the entry is saved to the database
     */
    async markIsConsumed(mealLoggingId){
        try {
            var entry = await this.mealLoggingRepository.findOneBy({id: mealLoggingId});
        }
        catch (e){
            return e;
        }

        entry.is_consumed = true;
        await this.mealLoggingRepository.save(entry);
        return true;
    }
}