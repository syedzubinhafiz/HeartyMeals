import { MeasuringUnit, conversionFactors, handMeasurementsToGrams } from "src/component/enum/measuring-unit.enum";
import * as jwt from 'jsonwebtoken';

import { User } from "src/user/user.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


export class CommonService{

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    convertUnits(originalUnit: MeasuringUnit, originalAmount: number, newUnit: MeasuringUnit): number{

        if (originalUnit === newUnit) {
            return originalAmount;
        }
    
        // Convert hand measurements to grams first
        if (handMeasurementsToGrams[originalUnit]) {
            originalAmount *= handMeasurementsToGrams[originalUnit];
            originalUnit = MeasuringUnit.GRAM;
        }
    
        // Convert grams to hand measurements
        if (originalUnit === MeasuringUnit.GRAM && handMeasurementsToGrams[newUnit]) {
            return originalAmount / handMeasurementsToGrams[newUnit];
        }
    
        // Convert grams to the target unit
        if (conversionFactors[originalUnit] && conversionFactors[newUnit]) {
            const amountInGramsOrMl = originalAmount * conversionFactors[originalUnit];
            return amountInGramsOrMl / conversionFactors[newUnit];
        }
    
        throw new Error(`Conversion from ${originalUnit} to ${newUnit} is not supported.`);
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
}