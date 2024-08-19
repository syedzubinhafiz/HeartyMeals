import { MeasuringUnit } from "src/library/recipe/component/measuring-unit.enum";
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
}