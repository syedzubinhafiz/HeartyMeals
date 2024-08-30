import { MeasuringUnit } from "src/component/enum/measuring-unit.enum";
import * as jwt from 'jsonwebtoken';

import { User } from "src/user/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from "src/user/user.service";
import { HttpException } from "@nestjs/common";
import { MealLogSummary } from "src/meal-log-summary/meal-log-summary.entity";


export class CommonService{

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(MealLogSummary)
        private mealLogSummaryRepository: Repository<MealLogSummary>,
        private userService: UserService,
    ){}

    convertUnits(originalUnit: MeasuringUnit, originalAmount: number, newUnit: MeasuringUnit, newAmount: number): number{

        return 0
    }

    decodeHeaders(authHeader: string){

        if (!authHeader) {
            throw new Error('Authorization header not found');
        }
    
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Token not found');
        }

        try {
            const decoded = jwt.decode(token);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Checks the date format
     * @param date - date to validate
     * @returns true if the date is in the format of YYYY-MM-DDTHH:MM:SS.SSS+-HHMM else false
     */
    validateDate(date: string): boolean{
        // check for valid date format
        const date_pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}$/;
        if (!date || !date_pattern.test(date)) { return false; }
        return true;
    }

    /**
     * Get the remaining budget of a user in a specific date
     * @param decodedHeaders - decoded headers from the request
     * @param dateString - date to get the remaining budget, in string
     * @returns remaining budget of a user in a specific date
     */
    async getRemainingBudget(decodedHeaders: any, dateString: string = null){
        if (!await this.userService.verifyUser(decodedHeaders)){ return new HttpException(`User with ${decodedHeaders['sub']} not found`, 400); }

        const user_id = decodedHeaders['sub'];

        const user_object = await this.userRepository.findOneBy({ user_id: user_id });

        var date = null;
        if (dateString == null){
            date = new Date();
        }
        else {
            if (!this.validateDate(dateString)){ throw new Error("Invalid date format. Date must be in YYYY-MM-DDTHH:MM:SS.SSS+-HHMM format."); }
            date = new Date(dateString.split('T')[0]);
        }
        

        var meal_logging_summary_entry = await this.mealLogSummaryRepository.createQueryBuilder('meal_log_summary')
            .where('user_id = :user_id', {user_id: user_id})
            .andWhere('date = :meal_date', {meal_date: date})
            .getOne();

        if (!meal_logging_summary_entry || meal_logging_summary_entry == null) {
            var remaining_nutrients = user_object.daily_budget as JSON;
            delete remaining_nutrients["water_intake"];

            meal_logging_summary_entry = new MealLogSummary();
            meal_logging_summary_entry.user = user_object;
            meal_logging_summary_entry.date = date;
            meal_logging_summary_entry.remaining_nutrients = user_object.daily_budget as JSON;

            try {
                await this.mealLogSummaryRepository.save(meal_logging_summary_entry);
            } catch (e) {
                throw new Error("Erro saving meal logging summary entry");
            }

            return remaining_nutrients;
        }
        else {
            return meal_logging_summary_entry.remaining_nutrients;
        }
    }
}