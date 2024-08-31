import { MeasuringUnit } from "src/component/enum/measuring-unit.enum";
import * as jwt from 'jsonwebtoken';

import { User } from "src/user/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


export class CommonService{

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
     * Checks if the two dates are the same day
     * @param date1 - first date in Date object
     * @param date2 - second date in Date object
     * @returns true if the two dates are the same day, else false
     */
    isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.toDateString() === date2.toDateString()
        );
      }
}