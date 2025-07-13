import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealLogSummary } from 'src/meal-log-summary/meal-log-summary.entity';
import { MealLogging } from 'src/meal-logging/meal-logging.entity';
import { AddRecipeDTO } from 'src/recipe/dto/add-recipe-dto';
import { RecipeDTO } from 'src/recipe/dto/recipe-dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { addDays, format } from 'date-fns';
import { getDailyAnalyticsDTO } from './dto/get-analytics-dto';



// [name for frontend, nutrition budget name in user table]
const DATA_LIST = [
    ['calories', "calories", "calories"], 
    ['protein', "protein", "protein"], 
    ['carbs', "carbs", "totalCarbohydrate"], 
    ['fat', "fat", "fat"],
    ['cholesterol', "cholesterol", "cholesterol"],
    ['sodium', "sodium", "sodium"]
];

const MEAL_TYPE =  [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Other"
]

@Injectable()
export class AnalyticsService {

    constructor(
        @InjectRepository(MealLogSummary)
        private mealLogSummaryRepository: Repository<MealLogSummary>,
        @InjectRepository(MealLogging)
        private mealLoggingRepository: Repository<MealLogging>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}


    /**
     * This method is used to get the daily analytics.
     * @param decodedHeaders        header containing the user id
     * @param date                  date of the analytics
     * @returns                     analytics result
     */
    async getDailyAnalytics(decodedHeaders: any, payload: getDailyAnalyticsDTO) {

        try{
            console.log(`[Analytics] Fetching daily analytics for user: ${decodedHeaders['sub']}, date: ${payload.date}, timezone: ${payload.timeZone}`);

            const user =  await this.userRepository.findOneByOrFail({user_id: decodedHeaders['sub']});
            console.log(`[Analytics] User daily budget:`, user.daily_budget);
            
            const start_of_date =  `${payload.date} 00:00:00`;
            const end_of_date =  `${payload.date} 23:59:59`;
            
            const meal_logging_summary = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                .where('meal_log_summary.date AT TIME ZONE :timeZone BETWEEN :start_of_day AND :end_of_day', { timeZone: payload.timeZone, start_of_day: start_of_date, end_of_day: end_of_date })
                .andWhere('meal_log_summary.user_id = :user_id', {user_id: decodedHeaders['sub']})
                .getOne();
                
            console.log(`[Analytics] Meal logging summary found:`, meal_logging_summary ? 'YES' : 'NO');
            if (meal_logging_summary) {
                console.log(`[Analytics] Summary data:`, meal_logging_summary);
            }


            if (meal_logging_summary == null) {
                                return {
                    "daily_budget": {
                        "calories": parseFloat(user.daily_budget[DATA_LIST[0][1]].toFixed(2)),
                        "protein": parseFloat(user.daily_budget[DATA_LIST[1][1]].toFixed(2)),
                        "carbohydrates": parseFloat(user.daily_budget[DATA_LIST[2][1]].toFixed(2)),
                        "fat": parseFloat(user.daily_budget[DATA_LIST[3][1]].toFixed(2)),
                        "cholesterol": parseFloat(user.daily_budget[DATA_LIST[4][1]].toFixed(2)),
                        "sodium": parseFloat(user.daily_budget[DATA_LIST[5][1]].toFixed(2)),
                    },
                    "remaining_nutrients": {
                        "calories": parseFloat(user.daily_budget[DATA_LIST[0][1]].toFixed(2)),
                        "protein": parseFloat(user.daily_budget[DATA_LIST[1][1]].toFixed(2)),
                        "carbohydrates": parseFloat(user.daily_budget[DATA_LIST[2][1]].toFixed(2)),
                        "fat": parseFloat(user.daily_budget[DATA_LIST[3][1]].toFixed(2)),
                        "cholesterol": parseFloat(user.daily_budget[DATA_LIST[4][1]].toFixed(2)),
                        "sodium": parseFloat(user.daily_budget[DATA_LIST[5][1]].toFixed(2)),
                    },
                    "breakfast": [],
                    "breakfast_total": {
                        "calories": 0,
                        "protein": 0,
                        "carbohydrates": 0,
                        "fat": 0,
                        "cholesterol": 0,
                        "sodium": 0
                    },
                    "lunch": [],
                    "lunch_total": {
                        "calories": 0,
                        "protein": 0,
                        "carbohydrates": 0,
                        "fat": 0,
                        "cholesterol": 0,
                        "sodium": 0
                    },
                    "dinner": [],
                    "dinner_total": {
                        "calories": 0,
                        "protein": 0,
                        "carbohydrates": 0,
                        "fat": 0,
                        "cholesterol": 0,
                        "sodium": 0
                    },
                    "other": [],
                    "other_total": {
                        "calories": 0,
                        "protein": 0,
                        "carbohydrates": 0,
                        "fat": 0,
                        "cholesterol": 0,
                        "sodium": 0
                    }
                };

            }

            
            const meal_logging_ids = MEAL_TYPE.flatMap(meal => meal_logging_summary.food_consumed[meal]);
            


            // No record 
            if (meal_logging_summary == null || meal_logging_ids.length == 0) {
                return {
                    "daily_budget": {
                        "calories": parseFloat(user.daily_budget[DATA_LIST[0][1]].toFixed(2)),
                        "protein": parseFloat(user.daily_budget[DATA_LIST[1][1]].toFixed(2)),
                        "carbohydrates": parseFloat(user.daily_budget[DATA_LIST[2][1]].toFixed(2)),
                        "fat": parseFloat(user.daily_budget[DATA_LIST[3][1]].toFixed(2)),
                        "cholesterol": parseFloat(user.daily_budget[DATA_LIST[4][1]].toFixed(2)),
                        "sodium": parseFloat(user.daily_budget[DATA_LIST[5][1]].toFixed(2)),
                    },
                    "remaining_nutrients": {
                        "calories": parseFloat(user.daily_budget[DATA_LIST[0][1]].toFixed(2)),
                        "protein": parseFloat(user.daily_budget[DATA_LIST[1][1]].toFixed(2)),
                        "carbohydrates": parseFloat(user.daily_budget[DATA_LIST[2][1]].toFixed(2)),
                        "fat": parseFloat(user.daily_budget[DATA_LIST[3][1]].toFixed(2)),
                        "cholesterol": parseFloat(user.daily_budget[DATA_LIST[4][1]].toFixed(2)),
                        "sodium": parseFloat(user.daily_budget[DATA_LIST[5][1]].toFixed(2)),
                    },
                    "breakfast": [],
                    "breakfast_total": {
                        "calories": 0,
                        "protein": 0,
                        "carbohydrates": 0,
                        "fat": 0,
                        "cholesterol": 0,
                        "sodium": 0
                    },
                    "lunch": [],
                    "lunch_total": {
                        "calories": 0,
                        "protein": 0,
                        "carbohydrates": 0,
                        "fat": 0,
                        "cholesterol": 0,
                        "sodium": 0
                    },
                    "dinner": [],
                    "dinner_total": {
                        "calories": 0,
                        "protein": 0,
                        "carbohydrates": 0,
                        "fat": 0,
                        "cholesterol": 0,
                        "sodium": 0
                    },
                    "other": [],
                    "other_total": {
                        "calories": 0,
                        "protein": 0,
                        "carbohydrates": 0,
                        "fat": 0,
                        "cholesterol": 0,
                        "sodium": 0
                    }
                };

            } else { // Record exists

                const meal_logging_map = await this.mealLoggingRepository.createQueryBuilder('meal_logging')
                    .leftJoinAndSelect("meal_logging.recipe", "recipe")
                    .where('meal_logging.id IN (:...ids)', { ids: meal_logging_ids })
                    .getMany()
                    .then(meal_logging_list => meal_logging_list.reduce((map, obj) => {
                        map[obj.id] = obj;
                        return map;
                    }, {}));

                // Initialize the result object
                const result =  {
                    "daily_budget": {
                        "calories": parseFloat(user.daily_budget[DATA_LIST[0][1]].toFixed(2)),
                        "protein": parseFloat(user.daily_budget[DATA_LIST[1][1]].toFixed(2)),
                        "carbohydrates": parseFloat(user.daily_budget[DATA_LIST[2][1]].toFixed(2)),
                        "fat": parseFloat(user.daily_budget[DATA_LIST[3][1]].toFixed(2)),
                        "cholesterol": parseFloat(user.daily_budget[DATA_LIST[4][1]].toFixed(2)),
                        "sodium": parseFloat(user.daily_budget[DATA_LIST[5][1]].toFixed(2)),
                    },
                    "remaining_budget": {
                        "calories": parseFloat(meal_logging_summary.remaining_nutrients[DATA_LIST[0][1]].toFixed(2)),
                        "protein": parseFloat(meal_logging_summary.remaining_nutrients[DATA_LIST[1][1]].toFixed(2)),
                        "carbohydrates": parseFloat(meal_logging_summary.remaining_nutrients[DATA_LIST[2][1]].toFixed(2)),
                        "fat": parseFloat(meal_logging_summary.remaining_nutrients[DATA_LIST[3][1]].toFixed(2)),
                        "cholesterol": parseFloat(meal_logging_summary.remaining_nutrients[DATA_LIST[4][1]].toFixed(2)),
                        "sodium": parseFloat(meal_logging_summary.remaining_nutrients[DATA_LIST[5][1]].toFixed(2)),
                    }
                };
                // Go through each of the meal type and figure out the total
                MEAL_TYPE.forEach(mealType => {
                    // Used to store the list of food consumed of the meal type
                    const data = [];

                    // Used to store the total consumption of the meal type
                    const total_consumption = {
                        "calories":0,
                        "protein": 0,
                        "carbohydrates" : 0,
                        "fat" : 0,
                        "cholesterol" : 0,
                        "sodium" : 0,
                    }
                    

                    // Go through each of the meal type and figure out the total 
                    meal_logging_summary.food_consumed[mealType].forEach(log => {
                        
                        // find the log meal 
                        const meal_log =  meal_logging_map[log] as MealLogging;
                        
                        if (meal_log == undefined) {
                            console.warn(`[Analytics] Skipping orphaned meal log ID: ${log} - record not found in meal_logging table`);
                            // TODO: Clean up orphaned reference from meal_log_summary.food_consumed
                            return; // Skip this meal instead of crashing
                        }
                        
                        // Get the nutrition and calories for each of the log meal 
                        const multiplier = Number(meal_log.portion) / Number(meal_log.recipe.serving_size);
                        const mealItem = {
                            "name": meal_log.recipe.name,
                            "calories": parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[0][2]] * multiplier).toFixed(2)),
                            "protein": parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[1][2]] * multiplier).toFixed(2)),
                            "carbohydrates" : parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[2][2]] * multiplier).toFixed(2)),
                            "fat" : parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[3][2]] * multiplier).toFixed(2)),
                            "cholesterol" : parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[4][2]] * multiplier).toFixed(2)),
                            "sodium" : parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[5][2]] * multiplier).toFixed(2)),
                            "is_consumed": meal_log.is_consumed
                        };
                        
                        data.push(mealItem);
                        
                        // Only count nutrition for consumed meals in totals
                        if (meal_log.is_consumed) {
                            // Update the total consumption of the meal type
                            total_consumption["calories"] += parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[0][2]] * multiplier).toFixed(2));
                            total_consumption["protein"] += parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[1][2]] * multiplier).toFixed(2));
                            total_consumption["carbohydrates"] += parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[2][2]] * multiplier).toFixed(2));
                            total_consumption["fat"] += parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[3][2]] * multiplier).toFixed(2));
                            total_consumption["cholesterol"] += parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[4][2]] * multiplier).toFixed(2));
                            total_consumption["sodium"] += parseFloat((meal_log.recipe.nutrition_info[DATA_LIST[5][2]] * multiplier).toFixed(2));
                        }
                    });
                    
                    
                    // Update the result with the meal type
                    result[mealType] = data;
                    result[mealType + "_total"] = total_consumption;
                    
                    // Final meal type data processed
                })
            
                return result;
            }
        } catch (e){
            console.error(`[Analytics] Error in getDailyAnalytics:`, e);
            console.error(`[Analytics] Error details:`, {
                message: e.message,
                stack: e.stack,
                userId: decodedHeaders?.['sub'],
                date: payload?.date,
                timeZone: payload?.timeZone
            });
            throw new Error(e.message);
        }

    }

    /**
     * This method is used to get the analytics by a date range.
     * @param decodedHeaders    header containing the user id
     * @param startDate         start date of the analytics
     * @param endDate           end date of the analytics
     * @param numberOfDays      number of days in the date range
     * @returns                 analytics result
     */

    async getAnalyticsByDate(decodedHeaders: any, startDate: string, endDate: string, timeZone: string, numberOfDays: number) {
        try {
            const user = await this.userRepository.findOneByOrFail({ user_id: decodedHeaders['sub'] });

            const start_date_start_of_date = `${startDate} 00:00:00`;
            const end_date_end_of_date = `${endDate} 23:59:59`;

            const meal_logging_summary_list = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
                .where('meal_log_summary.date AT TIME ZONE :timeZone BETWEEN :start_of_date AND :end_of_date', { timeZone: timeZone, start_of_date: start_date_start_of_date, end_of_date: end_date_end_of_date })
                .andWhere('meal_log_summary.user_id = :user_id', { user_id: decodedHeaders['sub'] })
                .orderBy('meal_log_summary.date', 'ASC')
                .getMany();

            const result = {
                "start_date": startDate,
                "end_date": endDate,
            };

            DATA_LIST.forEach((data) => {
                result[data[0]] = {
                    "daily_budget": parseFloat((user.daily_budget[data[1]]).toFixed(2)),
                    "average_daily": 0,
                    "difference": 0,
                    "percentage_of_daily_budget": 0,
                    "days": []
                };
            });

            const total_consumption = {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "cholesterol": 0,
                "sodium": 0
            };
            const day_under_budget = {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0,
                "cholesterol": 0,
                "sodium": 0
            };

            // Generate a list of all dates between startDate and endDate
            const allDates = [];
            let currentDate = new Date(startDate);
            const endDateObj = new Date(endDate);
            while (currentDate <= endDateObj) {
                allDates.push(format(currentDate, 'yyyy-MM-dd'));
                currentDate = addDays(currentDate, 1);
            }

            // Create a map of meal log summaries by date for quick lookup
            const mealLogSummaryMap = new Map();
            meal_logging_summary_list.forEach((meal_log_summary) => {
                mealLogSummaryMap.set(format(new Date(meal_log_summary.date), 'yyyy-MM-dd'), meal_log_summary);
            });

            // Go through each date and calculate the total consumption
            allDates.forEach((date) => {
                const meal_log_summary = mealLogSummaryMap.get(date);
                DATA_LIST.forEach((nutrient) => {
                    let nutrient_consumption = 0;
                    if (meal_log_summary) {
                        nutrient_consumption = parseFloat(user.daily_budget[nutrient[1]].toFixed(2)) - parseFloat(meal_log_summary.remaining_nutrients[nutrient[1]].toFixed(2));
                    }
                    if (nutrient_consumption >= 0) {
                        day_under_budget[nutrient[0]] += 1;
                    }
                    result[nutrient[0]]["days"].push({
                        "date": date,
                        "consumption": parseFloat(nutrient_consumption.toFixed(2))
                    });
                    total_consumption[nutrient[0]] += nutrient_consumption;
                });
            });

            // Calculate the average daily consumption and the difference between the daily budget and the average daily consumption
            DATA_LIST.forEach((nutrient) => {
                result[nutrient[0]]["average_daily"] = parseFloat((total_consumption[nutrient[0]] / numberOfDays).toFixed(2));
                result[nutrient[0]]["difference"] = parseFloat((result[nutrient[0]]["average_daily"] - user.daily_budget[nutrient[1]]).toFixed(2));
                result[nutrient[0]]["percentage_of_daily_budget"] = parseFloat((day_under_budget[nutrient[0]] / numberOfDays * 100).toFixed(2));
            });

            return result;
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

