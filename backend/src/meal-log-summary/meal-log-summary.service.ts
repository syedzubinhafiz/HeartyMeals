import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { Repository } from "typeorm";
import { CreateMealLoggingSummaryDTO } from "./dto/create-meal-logging-summary-dto";

@Injectable()
export class MealLogSummaryService {
    constructor(
        @InjectRepository(MealLogSummary)
        private mealLogSummaryRepository: Repository<MealLogSummary>
    ){}

    async createMealLoggingSummary(decodedHeaders: any, createMealLoggingSummaryDTO: CreateMealLoggingSummaryDTO){
    }
}