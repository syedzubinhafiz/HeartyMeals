import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { Repository } from "typeorm";

@Injectable()
export class MealLogSummaryService {
    constructor(
        @InjectRepository(MealLogSummary)
        private mealLogSummaryRepository: Repository<MealLogSummary>
    ){}

    /**
     * Get a meal logging summary entry in database using the id
     * @param mealLoggingSummaryId - The id of the meal logging summary to retrieve
     * @returns the entry in the meal logging summary table with the given id
     */
    async getMealLogSummary(mealLoggingSummaryId: string){
        const entry = await this.mealLogSummaryRepository.findOneBy({id: mealLoggingSummaryId});
        if (entry == undefined){ throw new Error ("No meal logging summary found with that id.")}
        return entry;
    }
}