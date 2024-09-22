import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { EntityManager, In, Repository } from "typeorm";
import { CalculateMealLoggingSummaryDTO } from "./dto/calculate-meal-logging-summary-dto";
import { User } from "src/user/user.entity";
import { MealLogging } from "src/meal-logging/meal-logging.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { CommonService } from "src/common/common.service";
import { UserService } from "src/user/user.service";
import { AddMealLoggingSummaryDTO } from "./dto/add-meal-logging-summary-dto";
import { MealLoggingService } from "src/meal-logging/meal-logging.service";
import { MealType } from "src/meal-type.enum";

@Injectable()
export class MealLogSummaryService {
    constructor(
        @InjectRepository(MealLogSummary)
        private mealLogSummaryRepository: Repository<MealLogSummary>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(MealLogging)
        private mealLoggingRepository: Repository<MealLogging>,
        @InjectRepository(Recipe)
        private recipeRepository: Repository<Recipe>,
        private commonService: CommonService,
        private userService: UserService,
        private mealLoggingService: MealLoggingService
    ){}

    /**
     * Adds the meal logging ids created to the meal logging summary
     * @param decodedHeaders - headers from request
     * @param addMealLoggingSummaryDTO - DTO containing the meal logging ids and nutrition info
     * @param mealLoggingIds - meal logging ids to be added to the meal logging summary
     * @param transactionalEntityManager - transactional entity manager
     * @returns true if the meal logging summary is added successfully
     * 
     */
    async addMealLoggingSummary(decodedHeaders: any, addMealLoggingSummaryDTO: AddMealLoggingSummaryDTO, mealLoggingIds: string[], transactionalEntityManager: EntityManager){

        const user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });

        // get the date only
        const meal_logging_summary_date = new Date(this.mealLoggingService.getISOStringWithTimezone(addMealLoggingSummaryDTO.mealDateTime, addMealLoggingSummaryDTO.timeZone));

        // get the start and end of the day 
        const startOfDay = `${addMealLoggingSummaryDTO.mealDateTime.split('T')[0]} 00:00:00`;
        const endOfDay = `${addMealLoggingSummaryDTO.mealDateTime.split('T')[0]} 23:59:59`;

        // get the entry
        // the entry will always exist because user will always call to get the remaining budget before logging the meal which will get the entry
        // or user will call to get daily budget which will get the entry also
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: addMealLoggingSummaryDTO.timeZone, startOfDay: startOfDay, endOfDay: endOfDay })
            .getOne();
        
        // add the new meal logging ids into the specified meal type in the meal logging summary 
        mealLoggingIds.forEach((item) => {
            meal_logging_summary_entry.food_consumed[addMealLoggingSummaryDTO.mealType].push(item);
        });

        meal_logging_summary_entry.remaining_nutrients = addMealLoggingSummaryDTO.nutritionAfter;

        try {
            await transactionalEntityManager.save(meal_logging_summary_entry);
            return true;
        }
        catch (e) {
            throw new HttpException(e, 400);
        }

    }

    /**
     * Calculate the nutrition info before logging the meal and after logging the meal
     * @param decodedHeaders - headers from request
     * @param calculateMealLoggingSummaryDTO - DTO containing the meals that user selected and portion
     * @returns [daily_budget, nutrition_before, nutrition_after]
     */
    async calculateNutritionSummary(decodedHeaders: any, calculateMealLoggingSummaryDTO: CalculateMealLoggingSummaryDTO){
        try {
            // Validate userId
            if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, HttpStatus.NOT_FOUND); }

         
            // get recipe ids
            const recipe_ids = calculateMealLoggingSummaryDTO.recipeIdPortions.map(recipe_id_portion => recipe_id_portion.recipeId);

            // get recipe objects
            const recipes = await this.recipeRepository.find({
                where: {
                    id: In(recipe_ids)
                }
            });

            const recipe_nutrition_portion = [];

            // combine the recipe id, nutrition info and portion into one list
            calculateMealLoggingSummaryDTO.recipeIdPortions.forEach(recipe_id_portion => {
                const recipe = recipes.find(r => r.id === recipe_id_portion.recipeId);
                if (recipe) {
                    recipe_nutrition_portion.push({
                        recipe_id: recipe_id_portion.recipeId,
                        nutrition_info: recipe.nutrition_info, 
                        recipe_portion: recipe.serving_size,
                        meal_logging_portion: recipe_id_portion.portion 
                    });
                }
                else {
                    throw new HttpException (`Recipe with id ${recipe_id_portion.recipeId} not found.`, HttpStatus.NOT_FOUND);
                }
            });

            // nutrition_list = [daily_budget, nutrition_before]
            const nutrition_list = await this.getRemainingBudget(decodedHeaders, calculateMealLoggingSummaryDTO.mealDateTime, calculateMealLoggingSummaryDTO.timeZone);

            // calculate the nutrition if the user plan to eat the meal
            const nutrition_after = this.commonService.calculateNutritionAfter(nutrition_list[1], recipe_nutrition_portion);

            var negative_nutrients = false;
            for (const key in nutrition_after) {
                if (nutrition_after[key] < 0) {
                    negative_nutrients = true;
                    break;
                }
            }
    
            return [nutrition_list[0], nutrition_list[1], nutrition_after, negative_nutrients];
        } catch (e) {
            throw e;
        }
    }

    /**
     * Remove the meal logging id from the meal logging summary, and add the nutrition back to the remaining nutrients.
     * This is called when the user deletes a meal logging from meal logging module.
     * @param decodedHeaders - headers from request
     * @param mealDate - date of the meal logging
     * @param systemDate - system date of the user
     * @param timeZone - timezone of the user
     * @param mealLoggingId - meal logging id to be removed
     * @param mealType - meal type of the meal logging 
     * @returns true if the meal logging id is removed successfully
     */
    async removeMealLoggingId(
        decodedHeaders: any, 
        mealDate: string, 
        systemDate: string, 
        timeZone: string, 
        mealLoggingId: string , 
        mealType: MealType, 
        transactionalEntityManager: EntityManager
    ){
        // remove the meal logging id from the meal logging summary
        // Validate userId
        if (!await this.userService.verifyUser(decodedHeaders)){ 
            throw new HttpException(`User with ${decodedHeaders['sub']} not found`, HttpStatus.NOT_FOUND); 
        }

        // validate date
        if (!this.mealLoggingService.isValidMealDate(mealDate, systemDate, timeZone)){ 
            throw new HttpException(`"Cannot update meal loggings for past or future meals."`, HttpStatus.BAD_REQUEST); 
        }

        // get user id
        const user_id = decodedHeaders['sub'];

        // get the start and end of the day 
        const startOfDay = `${mealDate} 00:00:00`;
        const endOfDay = `${mealDate} 23:59:59`;

        // get the entry
        // the entry will always exist because user will always call to get the remaining budget before logging the meal which will get the entry
        // or user will call to get daily budget which will get the entry also
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_id})
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: timeZone, startOfDay: startOfDay, endOfDay: endOfDay })
            .getOne();

        // get meal logging object with recipe object
        const meal_logging_object = await this.mealLoggingRepository.findOneOrFail({
            where: { id: mealLoggingId },
            relations: ['recipe'],
        });

        // check if can remove the meal logging id from the meal logging summary
        if (!this.mealLoggingService.isSameDay(mealDate, meal_logging_object.consumed_date_time.toISOString(), timeZone)){ 
            throw new HttpException(`Meal logging id ${mealLoggingId} is not in the same day as ${mealDate}`, HttpStatus.BAD_REQUEST); 
        }

        // find the meal logging id from the food consumed meal type
        var found = false;
        for (const meal_logging_id of meal_logging_summary_entry.food_consumed[mealType]) {
            if (meal_logging_id === mealLoggingId) {
                found = true;
                break;
            }
        }
        if (!found){
            throw new HttpException(`Meal logging id ${mealLoggingId} not found in ${mealType}`, HttpStatus.NOT_FOUND);
        }

        // remove the meal logging id from the food consumed
        meal_logging_summary_entry.food_consumed[mealType] = meal_logging_summary_entry.food_consumed[mealType].filter(meal_logging_id => meal_logging_id !== mealLoggingId);

        // add the nutrition to the remaining nutrients
        meal_logging_summary_entry.remaining_nutrients["calories"] += meal_logging_object.recipe.nutrition_info["calories"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        meal_logging_summary_entry.remaining_nutrients["carbs"] += meal_logging_object.recipe.nutrition_info["totalCarbohydrate"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        meal_logging_summary_entry.remaining_nutrients["protein"] += meal_logging_object.recipe.nutrition_info["protein"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        meal_logging_summary_entry.remaining_nutrients["fat"] += meal_logging_object.recipe.nutrition_info["fat"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        meal_logging_summary_entry.remaining_nutrients["sodium"] += meal_logging_object.recipe.nutrition_info["sodium"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);
        meal_logging_summary_entry.remaining_nutrients["cholesterol"] += meal_logging_object.recipe.nutrition_info["cholesterol"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size);

        const nutrition_list = await this.getRemainingBudget(decodedHeaders, mealDate, timeZone);

        // check if each nutrient is within the daily budget
        const daily_budget = nutrition_list[0];

        if (meal_logging_summary_entry.remaining_nutrients["calories"] > daily_budget["calories"]){
            meal_logging_summary_entry.remaining_nutrients["calories"] = daily_budget["calories"];
        }
        if (meal_logging_summary_entry.remaining_nutrients["carbs"] > daily_budget["carbs"]){
            meal_logging_summary_entry.remaining_nutrients["carbs"] = daily_budget["carbs"];
        }
        if (meal_logging_summary_entry.remaining_nutrients["protein"] > daily_budget["protein"]){
            meal_logging_summary_entry.remaining_nutrients["protein"] = daily_budget["protein"];
        }
        if (meal_logging_summary_entry.remaining_nutrients["fat"] > daily_budget["fat"]){
            meal_logging_summary_entry.remaining_nutrients["fat"] = daily_budget["fat"];
        }
        if (meal_logging_summary_entry.remaining_nutrients["sodium"] > daily_budget["sodium"]){
            meal_logging_summary_entry.remaining_nutrients["sodium"] = daily_budget["sodium"];
        }
        if (meal_logging_summary_entry.remaining_nutrients["cholesterol"] > daily_budget["cholesterol"]){
            meal_logging_summary_entry.remaining_nutrients["cholesterol"] = daily_budget["cholesterol"];
        }

        try {
            return (await transactionalEntityManager.save(meal_logging_summary_entry)).id;
        } catch (e) {
            throw new HttpException(e, 400);
        }
        
    }

    /**
     * Update the nutrition budget 
     * @param decodedHeaders - headers from request
     * @param mealLoggingSummaryId - meal logging id
     * @param mealDate - date of the meal logging
     * @param systemDate - system date of the user
     * @param timeZone - timezone of the user
     * @param oldMealType - old meal type
     * @param newMealType - new meal type
     * @param transactionalEntityManager - transactional entity manager
     * @returns [daily_budget, nutrition_before, nutrition_after]
     */
    async updateNutritionBudget(
        decodedHeaders: any, 
        mealLoggingId: string, 
        mealDate: string,
        systemDate: string,
        timeZone: string,
        oldMealType: MealType,
        newMealType: MealType,
        transactionalEntityManager: EntityManager
    ){
        try {     
            // get the start and end of the day 
            const startOfDay = `${mealDate} 00:00:00`;
            const endOfDay = `${mealDate} 23:59:59`;

            // get the entry
            // the entry will always exist because user will always call to get the remaining budget before logging the meal which will get the entry
            // or user will call to get daily budget which will get the entry also
            var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                .where('user_id = :user_id', {user_id: decodedHeaders['sub']})
                .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: timeZone, startOfDay: startOfDay, endOfDay: endOfDay })
                .getOne();

            const updated_meal_logging_object = await transactionalEntityManager.findOneBy(MealLogging, { id: mealLoggingId });

            if ((new Date(updated_meal_logging_object.consumed_date_time)).toDateString() !== (new Date(meal_logging_summary_entry.date)).toDateString()) {
                // relocate the meal logging id to the new meal logging summary date
                
                // get the new meal logging summary entry
                var new_meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                    .where('user_id = :user_id', {user_id: decodedHeaders['sub']})
                    .andWhere('date = :meal_date', {meal_date: updated_meal_logging_object.consumed_date_time})
                    .getOne();

                if (!new_meal_logging_summary_entry || new_meal_logging_summary_entry == null) {
                    await this.getRemainingBudget(decodedHeaders, mealDate, timeZone);

                    console.log("created entry for tomorrow")

                    var new_meal_logging_summary_entry = await transactionalEntityManager.createQueryBuilder('meal_log_summary', 'meal_log_summary')
                        .where('meal_log_summary.user_id = :user_id', { user_id: decodedHeaders['sub'] })
                        .andWhere('meal_log_summary.date = :meal_date', { meal_date: updated_meal_logging_object.consumed_date_time })
                        .getOne() as MealLogSummary;

                }
                
                // add id to new date food consumed
                new_meal_logging_summary_entry.food_consumed[newMealType].push(mealLoggingId);

                // recalculate nutrition budget for new date
                const saved_new_entry = await this.calculateNutritionBudget(decodedHeaders, 
                    new_meal_logging_summary_entry, 
                    mealDate,
                    timeZone,
                    transactionalEntityManager);
                
                // remove meal logging id from old meal logging summary
                await this.removeMealLoggingId(
                    decodedHeaders, 
                    mealDate,
                    systemDate,
                    timeZone,
                    mealLoggingId,
                    oldMealType, 
                    transactionalEntityManager
                );

                return true;
                
            }
            else {
                // remove from old food consumed meal type
                meal_logging_summary_entry.food_consumed[oldMealType] = meal_logging_summary_entry.food_consumed[oldMealType].filter(meal_logging_id => meal_logging_id !== mealLoggingId);

                // add to new food consumed meal type
                meal_logging_summary_entry.food_consumed[newMealType].push(mealLoggingId);

                // recalculate new date nutrition budget
                const saved_entry = await this.calculateNutritionBudget(decodedHeaders, 
                    meal_logging_summary_entry, 
                    mealDate,
                    timeZone,
                    transactionalEntityManager);
                return true;
            }
        } catch (e) {
            throw e;
        }
    }

  
    async calculateNutritionBudget(decodedHeaders: any, mealLoggingSummaryEntry: MealLogSummary, mealDate: string, timeZone: string, transactionalEntityManager: EntityManager) {
        // get all the meal logging ids
        const combined_meal_logging_ids = mealLoggingSummaryEntry.food_consumed["Breakfast"].concat(
            mealLoggingSummaryEntry.food_consumed["Lunch"],
            mealLoggingSummaryEntry.food_consumed["Dinner"],
            mealLoggingSummaryEntry.food_consumed["Other"]
        );
    
        // get all the recipe objects
        const meal_logging_objects = await transactionalEntityManager.find(MealLogging, {
            where: {
                id: In(combined_meal_logging_ids)
            },
            relations: ['recipe']
        });
    
        // get the recipe id and recipe nutrition info 
        const recipe_nutrition_portion = meal_logging_objects.map(meal_logging_object => {
            return {
                recipe_id: meal_logging_object.recipe.id,
                nutrition_info: meal_logging_object.recipe.nutrition_info,
                recipe_portion: meal_logging_object.recipe.serving_size,
                meal_logging_portion: meal_logging_object.portion
            }
        });
    
        // nutrition_list = [daily_budget, nutrition_before]
        const nutrition_list = await this.getRemainingBudget(decodedHeaders, mealDate, timeZone);
    
        // calculate the nutrition if the user plan to eat the meal
        const nutrition_after = this.commonService.calculateNutritionAfter(nutrition_list[0], recipe_nutrition_portion);
    
        mealLoggingSummaryEntry.remaining_nutrients = nutrition_after;
        await transactionalEntityManager.save(mealLoggingSummaryEntry);
        return true;
    }
    
    /* @param decodedHeaders - decoded headers from the request
     * @param dateString - date to get the remaining budget, in string
     * @returns remaining budget of a user in a specific date
     */
    async getRemainingBudget(decodedHeaders: any, dateTime: string = null, timeZone: string = null){
        if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, HttpStatus.NOT_FOUND); }

        const user_object = await this.userRepository.findOneByOrFail({ user_id: decodedHeaders['sub'] });

        // get the start and end of the day 
        const startOfDay = `${dateTime.split('T')[0]} 00:00:00`;
        const endOfDay = `${dateTime.split('T')[0]} 23:59:59`;

        // get entry
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', { user_id: user_object.user_id })
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: timeZone, startOfDay: startOfDay, endOfDay: endOfDay })
            .getOne();

        var date = new Date(this.mealLoggingService.getISOStringWithTimezone(dateTime, timeZone));

        var daily_budget = user_object.daily_budget as JSON;
        delete daily_budget["water_intake"];

        if (!meal_logging_summary_entry || meal_logging_summary_entry == null) {

            meal_logging_summary_entry = new MealLogSummary();
            meal_logging_summary_entry.user = user_object;
            meal_logging_summary_entry.date = date;
            meal_logging_summary_entry.remaining_nutrients = daily_budget;

            try {
                await this.mealLogSummaryRepository.save(meal_logging_summary_entry);
            } catch (e) {
                throw new Error("Error saving meal logging summary entry");
            }

            return [daily_budget, meal_logging_summary_entry.remaining_nutrients, false];
        }
        else {
            var flag = false;
            for (const key in meal_logging_summary_entry.remaining_nutrients) {
                if (meal_logging_summary_entry.remaining_nutrients[key] < 0) {
                    flag = true;
                    break;
                }
              }

            return [daily_budget, meal_logging_summary_entry.remaining_nutrients, flag];
        }
    }
}