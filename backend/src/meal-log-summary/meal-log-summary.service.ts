import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealLogSummary } from "./meal-log-summary.entity";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";


@Injectable()
export class MealLogSummaryService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(MealLogSummary)
        private mealLogSummaryRepository: Repository<MealLogSummary>,
        private userService: UserService,
    ){}

    /**
     * Get the remaining budget of a user in a specific date
     * @param decodedHeaders - decoded headers from the request
     * @param dateString - date to get the remaining budget, in string
     * @returns remaining budget of a user in a specific date
     */
    async getRemainingBudget(decodedHeaders: any, dateString: DateValidationDTO = null){
        if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, 400); }

        const user_id = decodedHeaders['sub'];

        const user_object = await this.userRepository.findOneBy({ user_id: user_id });

        var date = null;
        if (dateString == null){
            date = new Date().toISOString().split('T')[0];
        }
        else {
            date = new Date(dateString.date.split('T')[0]);
        }
        
        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_id})
            .andWhere('date = :meal_date', {meal_date: date})
            .getOne();

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