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
import { DeleteMealLoggingDTO } from "src/meal-logging/dto/delete-meal-logging-dto";
import { UpdateMealLoggingDTO } from "src/meal-logging/dto/update-meal-logging-dto";
import { format, formatInTimeZone, toDate } from "date-fns-tz";
import { eachDayOfInterval } from "date-fns";

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

        // get the start and end of the day 
        const start_of_day = `${addMealLoggingSummaryDTO.mealDateTime.split('T')[0]} 00:00:00`;
        const end_of_day = `${addMealLoggingSummaryDTO.mealDateTime.split('T')[0]} 23:59:59`;

        // get the entry
        // the entry will always exist because user will always call to get the remaining budget before logging the meal which will get the entry
        // or user will call to get daily budget which will get the entry also
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: addMealLoggingSummaryDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
            .getOne();

            // if the entry does not exists, create a new entry
        if (meal_logging_summary_entry == null || meal_logging_summary_entry == undefined) {
            await this.getRemainingBudget(decodedHeaders, addMealLoggingSummaryDTO.mealDateTime, null, addMealLoggingSummaryDTO.timeZone, transactionalEntityManager);

            meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                .where('user_id = :user_id', {user_id: user_object.user_id})
                .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: addMealLoggingSummaryDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
                .getOne();
        }
        
        // add the new meal logging ids into the specified meal type in the meal logging summary 
        meal_logging_summary_entry.food_consumed[addMealLoggingSummaryDTO.mealType] = [
            ...meal_logging_summary_entry.food_consumed[addMealLoggingSummaryDTO.mealType],
            ...mealLoggingIds
        ];
        

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
     * @param deleteMealLoggingDTO - DTO containing the meal logging id, meal type, meal date, system date
     * @returns true if the meal logging id is removed successfully
     */
    async removeMealLoggingId(decodedHeaders: any, deleteMealLoggingDTO: DeleteMealLoggingDTO,transactionalEntityManager: EntityManager){
        // remove the meal logging id from the meal logging summary
        // Validate userId
        if (!await this.userService.verifyUser(decodedHeaders)){ 
            throw new HttpException(`User with ${decodedHeaders['sub']} not found`, HttpStatus.NOT_FOUND); 
        }

        // validate date - within today and 7 days in the future
        if (!this.mealLoggingService.isValidMealDate(deleteMealLoggingDTO.mealDate, deleteMealLoggingDTO.systemDate, deleteMealLoggingDTO.timeZone)){ 
            throw new HttpException(`"Cannot update meal loggings for past or future meals."`, HttpStatus.BAD_REQUEST); 
        }

        // get user id
        const user_id = decodedHeaders['sub'];

        // get the start and end of the day 
        const start_of_day = `${deleteMealLoggingDTO.mealDate} 00:00:00`;
        const end_of_day = `${deleteMealLoggingDTO.mealDate} 23:59:59`;

        // get the entry
        // the entry will always exist because user will always call to get the remaining budget before logging the meal which will get the entry
        // or user will call to get daily budget which will get the entry also
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_id})
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: deleteMealLoggingDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
            .getOne();

        // get meal logging object with recipe object
        const meal_logging_object = await this.mealLoggingRepository.findOneOrFail({
            where: { id: deleteMealLoggingDTO.mealLoggingId },
            relations: ['recipe'],
        });

        // check if can remove the meal logging id from the meal logging summary
        if (!this.mealLoggingService.isSameDay(deleteMealLoggingDTO.mealDate, meal_logging_object.consumed_date_time.toISOString(), deleteMealLoggingDTO.timeZone)){ 
            throw new HttpException(`Meal logging id ${deleteMealLoggingDTO.mealLoggingId} is not in the same day as ${deleteMealLoggingDTO.mealDate}`, HttpStatus.BAD_REQUEST); 
        }

        // find the meal logging id from the food consumed meal type
        var found = false;
        for (const meal_logging_id of meal_logging_summary_entry.food_consumed[deleteMealLoggingDTO.mealType]) {
            if (meal_logging_id === deleteMealLoggingDTO.mealLoggingId) {
                found = true;
                break;
            }
        }
        if (!found){
            throw new HttpException(`Meal logging id ${deleteMealLoggingDTO.mealLoggingId} not found in ${deleteMealLoggingDTO.mealType}`, HttpStatus.NOT_FOUND);
        }

        // remove the meal logging id from the food consumed
        meal_logging_summary_entry.food_consumed[deleteMealLoggingDTO.mealType] = meal_logging_summary_entry.food_consumed[deleteMealLoggingDTO.mealType].filter(meal_logging_id => meal_logging_id !== deleteMealLoggingDTO.mealLoggingId);

        // add the nutrition to the remaining nutrients
        meal_logging_summary_entry.remaining_nutrients["calories"] += (meal_logging_object.recipe.nutrition_info["calories"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2);
        meal_logging_summary_entry.remaining_nutrients["carbs"] += (meal_logging_object.recipe.nutrition_info["totalCarbohydrate"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2);
        meal_logging_summary_entry.remaining_nutrients["protein"] += (meal_logging_object.recipe.nutrition_info["protein"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2);
        meal_logging_summary_entry.remaining_nutrients["fat"] += (meal_logging_object.recipe.nutrition_info["fat"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2);
        meal_logging_summary_entry.remaining_nutrients["sodium"] += (meal_logging_object.recipe.nutrition_info["sodium"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2);
        meal_logging_summary_entry.remaining_nutrients["cholesterol"] += (meal_logging_object.recipe.nutrition_info["cholesterol"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2);

        try {
            return (await transactionalEntityManager.save(meal_logging_summary_entry)).id;
        } catch (e) {
            throw new HttpException(e, 400);
        }
        
    }

    /**
     * Update the nutrition budget 
     * @param decodedHeaders - headers from request
     * @param updateMealLoggingDTO - DTO containing the meal logging id, meal type, meal date, system date
     * @param newMealType - new meal type
     * @param transactionalEntityManager - transactional entity manager
     * @returns true when the meal logging summary is updated successfully
     */
    async updateMealLoggingSummary(decodedHeaders: any, updateMealLoggingDTO: UpdateMealLoggingDTO, oldMealType: MealType,transactionalEntityManager: EntityManager){
        try {     
            // get the start and end of the day 
            const start_of_day = `${updateMealLoggingDTO.mealDate} 00:00:00`;
            const end_of_day = `${updateMealLoggingDTO.mealDate} 23:59:59`;

            // get the entry
            // the entry will always exist because user will always call to get the remaining budget before logging the meal which will get the entry
            // or user will call to get daily budget which will get the entry also
            var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                .where('user_id = :user_id', {user_id: decodedHeaders['sub']})
                .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: updateMealLoggingDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
                .getOne();

            if (updateMealLoggingDTO.newMealDate){
                // meal planning

                // get the other date meal logging summary entry
                var new_date_meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                    .where('user_id = :user_id', {user_id: decodedHeaders['sub']})
                    .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: updateMealLoggingDTO.timeZone, startOfDay: `${updateMealLoggingDTO.newMealDate} 00:00:00`, endOfDay: `${updateMealLoggingDTO.newMealDate} 23:59:59` })
                    .getOne();

                // put the meal logging id into the new date meal logging summary entry
                new_date_meal_logging_summary_entry.food_consumed[updateMealLoggingDTO.mealType].push(updateMealLoggingDTO.mealLoggingId);

                // recalculating the new date nutrition budget
                await this.calculateNutritionBudget(decodedHeaders, 
                    new_date_meal_logging_summary_entry, 
                    updateMealLoggingDTO.newMealDate,
                    updateMealLoggingDTO.timeZone,
                    transactionalEntityManager);

                // remove from old food consumed meal type
                meal_logging_summary_entry.food_consumed[oldMealType] = meal_logging_summary_entry.food_consumed[oldMealType].filter(meal_logging_id => meal_logging_id !== updateMealLoggingDTO.mealLoggingId);

                // recalculate old date nutrition budget
                await this.calculateNutritionBudget(decodedHeaders, 
                    meal_logging_summary_entry, 
                    updateMealLoggingDTO.mealDate,
                    updateMealLoggingDTO.timeZone,
                    transactionalEntityManager);
                
                return true;
            }
            else {
                // meal logging

                // remove from old food consumed meal type
                meal_logging_summary_entry.food_consumed[oldMealType] = meal_logging_summary_entry.food_consumed[oldMealType].filter(meal_logging_id => meal_logging_id !== updateMealLoggingDTO.mealLoggingId);

                // add to new food consumed meal type
                meal_logging_summary_entry.food_consumed[updateMealLoggingDTO.mealType].push(updateMealLoggingDTO.mealLoggingId);

                // recalculate new date nutrition budget
                await this.calculateNutritionBudget(decodedHeaders, 
                    meal_logging_summary_entry, 
                    updateMealLoggingDTO.mealDate,
                    updateMealLoggingDTO.timeZone,
                    transactionalEntityManager);
                return true;
            }
            
        } catch (e) {
            throw e;
        }
    }

    /**
     * Recalcuylate the nutrition budget after a meal logging is updated
     * @param decodedHeaders - decoded headers from the request
     * @param mealLoggingSummaryEntry - meal logging summary entry
     * @param mealDate - date of the meal
     * @param timeZone - timezone of the user
     * @param transactionalEntityManager - transactional entity manager
     * @returns true when the nutrition budget is recalculated successfully
     */
    async calculateNutritionBudget(decodedHeaders: any, mealLoggingSummaryEntry: MealLogSummary, mealDate: string, timeZone: string, transactionalEntityManager: EntityManager) {
        // get all the meal logging ids
        const combined_meal_logging_ids = mealLoggingSummaryEntry.food_consumed["Breakfast"].concat(
            mealLoggingSummaryEntry.food_consumed["Lunch"],
            mealLoggingSummaryEntry.food_consumed["Dinner"],
            mealLoggingSummaryEntry.food_consumed["Other"]
        );
    
        // get all the recipe objects
        const meal_logging_objects = await this.mealLoggingRepository.find({
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
    
    /**
     * Get the user remaining budget 
     * @param decodedHeaders - headers from request
     * @param dateTime - date time
     * @param timeZone - timezone
     * @param transactionalEntityManager - transactional entity manager
     * @returns a list containing the daily budget, remaining nutrients, and a flag indicating if the user has exceeded the budget
     */
    async getRemainingBudget(decodedHeaders: any, startDateTime: string, endDateTime: string = null, timeZone: string = null, transactionalEntityManager: EntityManager = null){
        if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, HttpStatus.NOT_FOUND); }

        const user_object = await this.userRepository.findOneByOrFail({ user_id: decodedHeaders['sub'] });

        // get the start and end of the day 
        const start_of_day = `${startDateTime.split('T')[0]} 00:00:00`;


        var end_of_day = null;
        // if endDateTime is not provided, set it to the end of the day
        if (endDateTime != null) {
            end_of_day = `${endDateTime.split('T')[0]} 23:59:59`;
        }
        else {
            end_of_day = `${startDateTime.split('T')[0]} 23:59:59`;
            endDateTime = startDateTime;
        }

        console.log(start_of_day, end_of_day);

        // get entries
        var meal_logging_summary_entries = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', { user_id: user_object.user_id })
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
            .getMany();

        // var date = new Date(this.mealLoggingService.getISOStringWithTimezone(startDateTime, timeZone));

        var daily_budget = user_object.daily_budget as JSON;
        delete daily_budget["water_intake"];

        // get the date range from startDateTime to endDateTime
        const list_of_dates = this.listDatesWithTimezone(startDateTime.split('T')[0], endDateTime.split('T')[0], timeZone);

        // map the entries by their date
        const entries_grouped_by_date = meal_logging_summary_entries.reduce((acc, entry) => {
            const zoned_date = toDate(entry.date, {timeZone});
            const formatted_date = formatInTimeZone(zoned_date, timeZone, 'yyyy-MM-dd');
        
            if (!acc[formatted_date]) {
                acc[formatted_date] = entry;
            }
        
            return acc;
        }, {});

        var output = {};
        var new_entries = [];

        // find if the date is not in the entries, create a new entry
        for (const date of list_of_dates) {
            if (!(date in entries_grouped_by_date)) {
                // date does not exists
                // create new entry
                const new_entry = new MealLogSummary();
                new_entry.user = user_object;
                new_entry.date = new Date(date);
                new_entry.remaining_nutrients = daily_budget;

                new_entries.push(new_entry);


                output[date] = [daily_budget, daily_budget, false];
            }
            else {
                // date exists
                const meal_logging_summary_entry = entries_grouped_by_date[date];

                var flag = false;
                for (const key in meal_logging_summary_entry.remaining_nutrients) {
                    if (meal_logging_summary_entry.remaining_nutrients[key] < 0) {
                        flag = true;
                        break;
                    }
                }

                output[date] = [daily_budget, meal_logging_summary_entry.remaining_nutrients, flag];
            }
        }

        // if got new entries to save
        if (new_entries.length > 0) {
            try {
                if (transactionalEntityManager) {
                    await transactionalEntityManager.save(new_entries);
                } else {
                    await this.mealLogSummaryRepository.save(new_entries);
                }
            } catch (e) {
                throw new Error("Error saving meal logging summary entry");
            }
        }
        

        return output;
    }

    listDatesWithTimezone(startDate: string, endDate: string, timeZone: string): string[] {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const dates = eachDayOfInterval({ start, end }).map(date => {
            return formatInTimeZone(date, timeZone, 'yyyy-MM-dd')
        })

        return dates;
    }
}