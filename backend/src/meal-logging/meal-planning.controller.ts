import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";
import { CommonService } from "src/common/common.service";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { MealLogSummaryService } from "src/meal-log-summary/meal-log-summary.service";
import { DeleteMealLoggingDTO } from "./dto/delete-meal-logging-dto";
import { UpdateMealLoggingDTO } from "./dto/update-meal-logging-dto";


@Controller('meal-planning')
export class MealPlanningController {
    constructor(
        private mealLoggingService: MealLoggingService,
        private commonService: CommonService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        private mealLoggingSummaryService: MealLogSummaryService,
    ){}

    /**
     * Get method to get all the meals in a specific date
     * @param headers - headers that contains the authorization token
     * @param date - date requested to get the meals from
     * @param timeZone - timezone of the user
     * @returns a list of meals on the date, sorted by meal types
     */
    @Get('get')
    async getMealsPerDay(@Headers() headers, @Query('date') date: string, @Query('timeZone') timeZone: string){
    try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);

            return await this.mealLoggingService.getMealsPerDay(decoded_headers, date, timeZone);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
    }

    /**
     * Post method to update the meal logging to change to another day
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains the meal logging id and the new date
     * @returns HttpException 200 if the meal is updated 
     */
    @Post('update')
    async updateMealLogging(@Headers() headers, @Body() payload: UpdateMealLoggingDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                // update meal logging 
                const old_meal_type = await this.mealLoggingService.updateMealLogging(decoded_headers, payload, transactionalEntityManager);

                // update meal logging summary 
                await this.mealLoggingSummaryService.updateMealLoggingSummary(decoded_headers, payload,old_meal_type,transactionalEntityManager);
            });
            return new HttpException("Meal is updated.", HttpStatus.OK);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
    }

    /**
     * Post method to delete meal logging entries
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains a list of meal logging ids
     * @returns HttpException 200 when the meal is deleted 
     */
    @Delete('delete')
    async delete(@Headers() headers, @Body() payload: DeleteMealLoggingDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => { 

                await this.mealLoggingSummaryService.removeMealLoggingId(decoded_headers, payload, transactionalEntityManager);
                
                await this.mealLoggingService.deleteMealLogging(decoded_headers, payload, transactionalEntityManager);
            });
            return new HttpException("Meal is deleted.", HttpStatus.OK);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
        
    }
}