import { Body, Controller, Delete, Get, Headers, HttpException, Param, Post, Query } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";
import { CommonService } from "src/common/common.service";
import { AddMealLoggingDTO } from "./dto/add-meal-logging-dto";
import { UpdateMealLoggingDTO } from "./dto/update-meal-logging-dto";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { DeleteMealLoggingDTO } from "./dto/delete-meal-logging-dto";
// import { UpdateMealLoggingSummaryDTO } from "src/meal-log-summary/dto/update-meal-logging-summary-dto";
// import { MealLogSummaryService } from "src/meal-log-summary/meal-log-summary.service";
// import { RemoveMealLoggingIdDTO } from "src/meal-log-summary/dto/remove-meal-logging-id-dto";

@Controller('meal-logging')
export class MealLoggingController {
    constructor(
        private mealLoggingService: MealLoggingService,
        private commonService: CommonService,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        // private mealLoggingSummaryService: MealLogSummaryService,
    ){}

    /**
     * Post method to create all the meal loggings entry 
     * @param headers - headers that contains the authorization token
     * @param payload - payload containing userId, recipeIdList, and mealType
     * @returns HttpExecption 200 when all the meals have been logged
     */
    @Post('add')
    async addMealLogging(@Headers() headers, @Body() mealLoggingDTO: AddMealLoggingDTO){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);
            await this.mealLoggingService.addMealLogging(decoded_headers, mealLoggingDTO, this.entityManager);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }
        return new HttpException("All meals have been logged.", 200);
    }

    /**
     * Get method to get all the meals in a specific date
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains the userId and the date requested to get the meals from
     * @returns a list of meals on the date, sorted by meal types
     */
    @Get('get')
    async getMealsPerDay(@Headers() headers, @Query('date') date: string,){
    try {
        const auth_header = headers.authorization;
        const decoded_headers = this.commonService.decodeHeaders(auth_header);
        const dateValidationDTO = new DateValidationDTO();
        dateValidationDTO.date = date;

        return await this.mealLoggingService.getMealsPerDay(decoded_headers, dateValidationDTO);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }
    }

    /**
     * Post method to update the meal logging to change to another day
     * @param payload - payload that contains the meal logging id and the new date
     * @returns HttpException 200 if the meal is updated 
     */
    @Post('update_meal')
    async updateMealLogging(@Headers() headers, @Body() payload: UpdateMealLoggingDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const old_meal_type = await this.mealLoggingService.updateMealLogging(decoded_headers, payload, transactionalEntityManager);

                // TODO: recalculate the nutrition summary
                // const update_meal_logging_summary = new UpdateMealLoggingSummaryDTO();
                // update_meal_logging_summary.mealLoggingId = payload.mealLoggingId;
                // update_meal_logging_summary.oldMealType = old_meal_type;
                // update_meal_logging_summary.newMealType = payload.mealType;
                // update_meal_logging_summary.newDate = payload.newDate;
                // update_meal_logging_summary.mealLoggingSummaryId = payload.mealLoggingSummaryId;

                // await this.mealLoggingSummaryService.updateNutritionBudget(decoded_headers, update_meal_logging_summary, transactionalEntityManager);
            });
            return new HttpException("Meal is updated.", 200);
        }
        catch (e){
            return new HttpException(e.message, 400);
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
                // TODO: call meal logging summary to remove the meal logging id from the list
                // const removeMealLoggingIdDTO = new RemoveMealLoggingIdDTO();
                // removeMealLoggingIdDTO.mealLoggingId = payload.mealLoggingId;
                // removeMealLoggingIdDTO.date = payload.mealDate;
                // removeMealLoggingIdDTO.mealType = payload.mealType;

                // const meal_logging_summary_id = await this.mealLoggingSummaryService.removeMealLoggingId(decoded_headers, removeMealLoggingIdDTO, transactionalEntityManager);

                await this.mealLoggingService.deleteMealLogging(decoded_headers, payload, transactionalEntityManager);
            });
            return new HttpException("Meal is deleted.", 200);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }
        
    }

    /**
     * Post method to mark a meal is consumed
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains the specific meal logging id
     * @returns HttpException 200 when the meal is successfully marked consumed
     */
    @Post('mark_consumed')
    async markMealConsumed(@Headers() headers, @Body("mealLoggingId") payload){
        try {
            const auth_header = headers.authorization;
            const decoded_headers = this.commonService.decodeHeaders(auth_header);
            await this.mealLoggingService.markIsConsumed(decoded_headers, payload);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }

        return new HttpException("Meal is marked consumed.", 200);
    }
}