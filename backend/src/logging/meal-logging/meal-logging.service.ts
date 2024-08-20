import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogging } from "./meal-logging.entity";
import { Repository } from "typeorm";
import { MealType } from "../meal-type.enum";

@Injectable()
export class MealLoggingService {
    constructor(
        @InjectRepository(MealLogging)
        private mealLoggingRepository: Repository<MealLogging>,
    ){}

    async addMealLogging(userId, recipeId, mealType){
        
    }


    /**
     * Get all the meals of a user in a specific day
     * @param userId - valid user id
     * @param date - date 
     * @returns a list of lists of meals 
     */
    async getMealsPerDay(userId, date){
        try {
            // get all the meals recoreded in a dayz
            var entries = await this.mealLoggingRepository.find({
                where: {
                    user: userId,
                    date: date
                }
            })
        }
        catch (e){
            return e;
        }

        // sort them by their meal type
        var sorted = [[], [], [], []];
        entries.forEach(entry => {
            if (entry.type == MealType.BREAKFAST){
                sorted[0].push(entry);
            }
            else if (entry.type == MealType.LUNCH){
                sorted[1].push(entry);
            }
            else if (entry.type == MealType.DINNER){
                sorted[2].push(entry);
            }
            else {
                sorted[3].push(entry);
            }
        });
        return sorted;
    }

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