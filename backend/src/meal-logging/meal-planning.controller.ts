import { Body, Controller, Get, Headers, HttpException, Post } from "@nestjs/common";
import { MealLoggingService } from "./meal-logging.service";
import { CommonService } from "src/common/common.service";
import { AddMealLoggingDTO } from "./dto/add-meal-logging-dto";
import { UpdateMealLoggingDTO } from "./dto/update-meal-logging-dto";

@Controller('meal-planning')
export class MealPlanningController {
    constructor(
        private mealLoggingService: MealLoggingService,
        private commonService: CommonService
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
            const authHeader = headers.authorization;
            const decodedHeaders = this.commonService.decodeHeaders(authHeader);
            await this.mealLoggingService.addMealLogging(decodedHeaders, mealLoggingDTO);
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
    @Get('get_meals')
    async getMealsPerDay(@Headers() headers, @Body("date") payload){
        try {
            const authHeader = headers.authorization;
            const decodedHeaders = this.commonService.decodeHeaders(authHeader);
            return await this.mealLoggingService.getMealsPerDay(decodedHeaders, payload);
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
    async updateMealLogging(@Body() payload: UpdateMealLoggingDTO){
        try {
            await this.mealLoggingService.updateMealLogging(payload);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }
        return new HttpException("Meal is updated.", 200);
    }

    /**
     * Post method to delete meal logging entries
     * @param headers - headers that contains the authorization token
     * @param payload - payload that contains a list of meal logging ids
     * @returns HttpException 200 when the meal is deleted 
     */
    @Post('delete')
    async delete(@Headers() headers, @Body() payload){
        try {
            const authHeader = headers.authorization;
            const decodedHeaders = this.commonService.decodeHeaders(authHeader);
            await this.mealLoggingService.deleteMealLoggingBulk(decodedHeaders, payload.mealLoggingIds);
        }
        catch (e){
            return new HttpException(e.message, 400);
        }
        return new HttpException("Meal is deleted.", 200);
    }
}