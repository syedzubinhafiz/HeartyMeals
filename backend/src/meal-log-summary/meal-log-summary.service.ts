import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { EntityManager, In, Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { MealLogging } from "src/meal-logging/meal-logging.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { CommonService } from "src/common/common.service";
import { UserService } from "src/user/user.service";
import { AddMealLoggingSummaryDTO } from "./dto/add-meal-logging-summary-dto";
import { MealType } from "src/meal-type.enum";
import { DeleteMealLoggingDTO } from "src/meal-logging/dto/delete-meal-logging-dto";
import { UpdateMealLoggingDTO } from "src/meal-logging/dto/update-meal-logging-dto";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

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
    ){}

    /**
     * Adds the meal logging ids created to the meal logging summary
     * @param decodedHeaders - headers from request
     * @param addMealLoggingSummaryDTO - DTO containing the meal logging ids and nutrition info
     * @param mealLoggingIds - meal logging ids to be added to the meal logging summary
     * @param transactionalEntityManager - transactional entity manager
     * 
     */
    async addMealLoggingSummary(decodedHeaders: any, addMealLoggingSummaryDTO: AddMealLoggingSummaryDTO, mealLoggingIds: string[], transactionalEntityManager: EntityManager){

        const user_object = await this.userRepository.findOneBy({ user_id: decodedHeaders['sub'] });

        // get the start and end of the day 
        const start_of_day = `${addMealLoggingSummaryDTO.mealDate} 00:00:00`;
        const end_of_day = `${addMealLoggingSummaryDTO.mealDate} 23:59:59`;

        // get meal logging summary entry
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: addMealLoggingSummaryDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
            .getOne();

        // if the entry does not exists, create a new entry
        if (meal_logging_summary_entry == null || meal_logging_summary_entry == undefined) {
            meal_logging_summary_entry = await this.createMealLoggingSummary(user_object, fromZonedTime(addMealLoggingSummaryDTO.mealDate, addMealLoggingSummaryDTO.timeZone), transactionalEntityManager);
        }
        
        // add the new meal logging ids into the specified meal type in the meal logging summary 
        meal_logging_summary_entry.food_consumed[addMealLoggingSummaryDTO.mealType] = [
            ...meal_logging_summary_entry.food_consumed[addMealLoggingSummaryDTO.mealType],
            ...mealLoggingIds
        ];
        
        // set remaining nutrients
        meal_logging_summary_entry.remaining_nutrients = await this.calculateNutritionSummary(
            user_object, 
            addMealLoggingSummaryDTO.mealDate, 
            addMealLoggingSummaryDTO.timeZone,
            addMealLoggingSummaryDTO.recipeIdPortions,
            addMealLoggingSummaryDTO.mealType
        );

        try {
            await transactionalEntityManager.save(meal_logging_summary_entry);
        }
        catch (e) {
            throw new HttpException(e, 400);
        }

    }    

    /**
     * Calculate the nutrition info before logging the meal and after logging the meal
     * @param user_object - user object
     * @param mealDate - meal date
     * @param timeZone - timezone
     * @param recipeIdPortions - recipe id and portion
     * @param mealType - meal type
     * @returns [daily_budget, nutrition_before, nutrition_after, flag]
     */
    async calculateNutritionSummary(user_object: User, mealDate: string, timeZone: string, recipeIdPortions: {recipeId: string, portion: number}[], mealType: MealType){
        try {        
            // get recipe ids
            const recipe_ids = recipeIdPortions.map(recipe_id_portion => recipe_id_portion.recipeId);

            // get recipe objects
            const recipes = await this.recipeRepository.find({
                where: {
                    id: In(recipe_ids)
                }
            });

            const recipe_nutrition_portion = [];

            // combine the recipe id, nutrition info and portion into one list
            recipeIdPortions.forEach(recipe_id_portion => {
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

            // get meal logging summary entry
            var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                .where('user_id = :user_id', {user_id: user_object.user_id})
                .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: timeZone, startOfDay: `${mealDate} 00:00:00`, endOfDay: `${mealDate} 23:59:59` })
                .getOne();

            // if the entry does not exists, create a new entry
            if (meal_logging_summary_entry == null || meal_logging_summary_entry == undefined) {
                meal_logging_summary_entry = await this.createMealLoggingSummary(user_object, fromZonedTime(mealDate, timeZone), null);
            }

            // save a copy of user current budget
            const current_budget = meal_logging_summary_entry.remaining_nutrients;

            // calculate the nutrition if the user plan to eat the meal
            const nutrition_after = this.commonService.calculateNutritionAfter(current_budget, recipe_nutrition_portion);

            // find if there is any negative nutrients
            var negative_nutrients = false;
            for (const key in nutrition_after) {
                if (nutrition_after[key] < 0) {
                    negative_nutrients = true;
                    break;
                }
            }
    
            return nutrition_after;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Remove the meal logging id from the meal logging summary, and add the nutrition back to the remaining nutrients.
     * This is called when the user deletes a meal logging from meal logging module.
     * @param decodedHeaders - headers from request
     * @param deleteMealLoggingDTO - DTO containing the meal logging id, meal type, meal date, user local date
     * @param transactionalEntityManager - transactional entity manager
     */
    async removeMealLoggingId(decodedHeaders: any, deleteMealLoggingDTO: DeleteMealLoggingDTO,transactionalEntityManager: EntityManager){
        // remove the meal logging id from the meal logging summary
        // Validate userId
        if (!await this.userService.verifyUser(decodedHeaders)){ 
            throw new HttpException(`User with ${decodedHeaders['sub']} not found`, HttpStatus.NOT_FOUND); 
        }

        // validate date - within today and 7 days in the future
        if (!this.commonService.isWithinDateRange(deleteMealLoggingDTO.mealDate, deleteMealLoggingDTO.userLocalDate, deleteMealLoggingDTO.timeZone, 6)){ 
            throw new HttpException(`Cannot update meal loggings for past or future meals.`, HttpStatus.BAD_REQUEST); 
        }

        // get user id
        const user_id = decodedHeaders['sub'];

        // get the start and end of the day 
        const start_of_day = `${deleteMealLoggingDTO.mealDate} 00:00:00`;
        const end_of_day = `${deleteMealLoggingDTO.mealDate} 23:59:59`;

        // get meal logging summary entry
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_id})
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: deleteMealLoggingDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
            .getOne();

        // get meal logging object with recipe object
        const meal_logging_object = await this.mealLoggingRepository.createQueryBuilder('mealLogging')
            .leftJoinAndSelect('mealLogging.recipe', 'recipe')
            .select([
                'mealLogging.id',
                'mealLogging.portion',
                'recipe.id',
                'recipe.nutrition_info',
                'recipe.serving_size'
            ])
            .where('mealLogging.id = :id', { id: deleteMealLoggingDTO.mealLoggingId })
            .getOne();

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
        meal_logging_summary_entry.remaining_nutrients["calories"] += parseFloat((meal_logging_object.recipe.nutrition_info["calories"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2));
        meal_logging_summary_entry.remaining_nutrients["carbs"] += parseFloat((meal_logging_object.recipe.nutrition_info["totalCarbohydrate"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2));
        meal_logging_summary_entry.remaining_nutrients["protein"] += parseFloat((meal_logging_object.recipe.nutrition_info["protein"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2));
        meal_logging_summary_entry.remaining_nutrients["fat"] += parseFloat((meal_logging_object.recipe.nutrition_info["fat"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2));
        meal_logging_summary_entry.remaining_nutrients["sodium"] += parseFloat((meal_logging_object.recipe.nutrition_info["sodium"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2));
        meal_logging_summary_entry.remaining_nutrients["cholesterol"] += parseFloat((meal_logging_object.recipe.nutrition_info["cholesterol"] * (meal_logging_object.portion / meal_logging_object.recipe.serving_size)).toFixed(2));

        try {
            await transactionalEntityManager.save(meal_logging_summary_entry);
        } catch (e) {
            throw new HttpException(e, 400);
        }
        
    }

    /**
     * Update the nutrition budget 
     * @param decodedHeaders - headers from request
     * @param updateMealLoggingDTO - DTO containing the meal logging id, meal type, meal date, system date
     * @param oldMealType - old meal type
     * @param transactionalEntityManager - transactional entity manager
     */
    async updateMealLoggingSummary(decodedHeaders: any, updateMealLoggingDTO: UpdateMealLoggingDTO, oldMealType: MealType, transactionalEntityManager: EntityManager){
        try {     
            // get the start and end of the day 
            const start_of_day = `${updateMealLoggingDTO.mealDate} 00:00:00`;
            const end_of_day = `${updateMealLoggingDTO.mealDate} 23:59:59`;

            const user_object = await this.userRepository.findOneByOrFail({ user_id: decodedHeaders['sub'] });

            // get meal logging summary entry
            var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                .where('user_id = :user_id', {user_id: user_object.user_id})
                .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: updateMealLoggingDTO.timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
                .getOne();

            // check if the meal date is changed
            if (updateMealLoggingDTO.newMealDate !== null && updateMealLoggingDTO.newMealDate !== updateMealLoggingDTO.mealDate) {
                // meal planning

                // get the other date meal logging summary entry
                var new_date_meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                    .where('user_id = :user_id', {user_id: user_object.user_id})
                    .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: updateMealLoggingDTO.timeZone, startOfDay: `${updateMealLoggingDTO.newMealDate} 00:00:00`, endOfDay: `${updateMealLoggingDTO.newMealDate} 23:59:59` })
                    .getOne();

                

                // put the meal logging id into the new date meal logging summary entry
                new_date_meal_logging_summary_entry.food_consumed[updateMealLoggingDTO.mealType].push(updateMealLoggingDTO.mealLoggingId);

                // recalculating the new date nutrition budget
                await this.calculateNutritionBudget(user_object, new_date_meal_logging_summary_entry, transactionalEntityManager);

                // remove from old food consumed meal type
                meal_logging_summary_entry.food_consumed[oldMealType] = meal_logging_summary_entry.food_consumed[oldMealType].filter(meal_logging_id => meal_logging_id !== updateMealLoggingDTO.mealLoggingId);
                
                // recalculate old date nutrition budget
                await this.calculateNutritionBudget(user_object, meal_logging_summary_entry, transactionalEntityManager);
            }
            else {
                // meal logging

                // if meal type is changed, remove from old food consumed meal type and put to new place
                if (oldMealType !== updateMealLoggingDTO.mealType) {
                    meal_logging_summary_entry.food_consumed[oldMealType] = meal_logging_summary_entry.food_consumed[oldMealType].filter(meal_logging_id => meal_logging_id !== updateMealLoggingDTO.mealLoggingId);

                    // add to new food consumed meal type
                    meal_logging_summary_entry.food_consumed[updateMealLoggingDTO.mealType].push(updateMealLoggingDTO.mealLoggingId);
                }

                // recalculate new date nutrition budget (because the portion may change)
                await this.calculateNutritionBudget(user_object, meal_logging_summary_entry, transactionalEntityManager);
            }
        } catch (e) {
            throw new HttpException(e, 400);
        }
    }

    /**
     * Recalculate the nutrition budget after a meal logging is updated
     * @param mealLoggingSummaryEntry - meal logging summary entry
     * @param transactionalEntityManager - transactional entity manager
     */
    async calculateNutritionBudget(user: User, mealLoggingSummaryEntry: MealLogSummary, transactionalEntityManager: EntityManager) {
        // get all the meal logging ids
        const combined_meal_logging_ids = mealLoggingSummaryEntry.food_consumed["Breakfast"].concat(
            mealLoggingSummaryEntry.food_consumed["Lunch"],
            mealLoggingSummaryEntry.food_consumed["Dinner"],
            mealLoggingSummaryEntry.food_consumed["Other"]
        );
        
        // if there are meal logging ids after the update
        if (combined_meal_logging_ids.length > 0) {
            // get all the recipe objects
            const meal_logging_objects = await transactionalEntityManager.createQueryBuilder(MealLogging, 'mealLogging')
            .leftJoinAndSelect('mealLogging.recipe', 'recipe')
            .select([
                'mealLogging.id',
                'mealLogging.portion',
                'recipe.id',
                'recipe.nutrition_info',
                'recipe.serving_size'
            ])
            .where('mealLogging.id IN (:...ids)', { ids: combined_meal_logging_ids })
            .getMany();

            // get the recipe id and recipe nutrition info 
            const recipe_nutrition_portion = meal_logging_objects.map(meal_logging_object => {
                return {
                    recipe_id: meal_logging_object.recipe.id,
                    nutrition_info: meal_logging_object.recipe.nutrition_info,
                    recipe_portion: meal_logging_object.recipe.serving_size,
                    meal_logging_portion: meal_logging_object.portion
                }
            });

            // get current remaining nutrients
            const user_daily_budget = user.daily_budget as JSON;

            // recalculate the nutrition budget
            const nutrition_after = this.commonService.calculateNutritionAfter(user_daily_budget, recipe_nutrition_portion);

            mealLoggingSummaryEntry.remaining_nutrients = nutrition_after;
            await transactionalEntityManager.save(mealLoggingSummaryEntry);
        }
        else {
            // if no meal logging ids, set the remaining nutrients to the daily budget
            mealLoggingSummaryEntry.remaining_nutrients = user.daily_budget as JSON;
            await transactionalEntityManager.save(mealLoggingSummaryEntry);
        }
    }
    
    /**
     * Get the user remaining budget 
     * @param decodedHeaders - headers from request
     * @param dateTime - date time
     * @param timeZone - timezone
     * @param transactionalEntityManager - transactional entity manager
     * @returns a list containing the daily budget, remaining nutrients, and a flag indicating if the user has exceeded the budget
     */
    async getRemainingBudget(decodedHeaders: any, startDate: string, endDate: string = null, timeZone: string, transactionalEntityManager: EntityManager = null){
        // validate user id
        const user_object = await this.userRepository.findOneByOrFail({ user_id: decodedHeaders['sub'] });

        // get the start and end of the day 
        const start_of_day = `${startDate} 00:00:00`;
        var end_of_day = null;
        // if endDateTime is not provided, set it to the end of the day
        if (endDate != null) {
            end_of_day = `${endDate} 23:59:59`;
        }
        else {
            end_of_day = `${startDate} 23:59:59`;
            endDate = startDate;
        }

        // get mutliple meal logging summary entries
        var meal_logging_summary_entries = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', { user_id: user_object.user_id })
            .andWhere('date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: timeZone, startOfDay: start_of_day, endOfDay: end_of_day })
            .getMany();

        // get the date range from startDateTime to endDateTime
        const list_of_dates = this.commonService.listDatesWithTimezone(startDate, endDate, timeZone);

        // map the entries by their date
        const entries_grouped_by_date = meal_logging_summary_entries.reduce((acc, entry) => {
            // ensure it is formatted to user's timezone
            const formatted_date = formatInTimeZone(entry.date, timeZone, 'yyyy-MM-dd');
        
            if (!acc[formatted_date]) {
                acc[formatted_date] = entry;
            }
        
            return acc;
        }, {});

        var output = {};
        var new_entries = [];
        var daily_budget = user_object.daily_budget as JSON;
        delete daily_budget["water_intake"];

        // find if the date is not in the entries, create a new entry
        for (const date of list_of_dates) {
            if (!(date in entries_grouped_by_date)) {
                // create new entry
                await this.createMealLoggingSummary(user_object, fromZonedTime(date, timeZone), transactionalEntityManager);

                output[date] = [daily_budget, daily_budget, false];
            }
            else {
                // date exists
                const meal_logging_summary_entry = entries_grouped_by_date[date];

                // check if any of the nutrients are negative
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

    /**
     * Create a new meal logging summary entry
     * @param user - user object
     * @param date - date
     * @param transactionalEntityManager - transactional entity manager
     * @returns a new meal logging summary entry
     */
    async createMealLoggingSummary(user: User, date: Date, transactionalEntityManager: EntityManager): Promise<MealLogSummary> {
        const entry = new MealLogSummary();
        entry.user = user;
        entry.date = date;

        const daily_budget = user.daily_budget as JSON;
        delete daily_budget["water_intake"];
        entry.remaining_nutrients = daily_budget;

        try {
            if (transactionalEntityManager == null) {
                return await this.mealLogSummaryRepository.save(entry);
            } else {
                return await transactionalEntityManager.save(entry);
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}