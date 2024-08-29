import { InjectRepository } from "@nestjs/typeorm";
import { FluidLogging } from "./fluid-logging.entity";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { HttpException } from "@nestjs/common";

export class FluidLoggingService {
    constructor(
        @InjectRepository(FluidLogging)
        private fluidLoggingRepository: Repository<FluidLogging>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}
    
    async getFluidLogging(decodedHeaders: any, loggingDate: Date, water_intake: number){
        // // get user object
        // const user_object = await this.userRepository.findOneBy({user_id: decodedHeaders.user_id});
        // if (!user_object || user_object == null) { return new HttpException(`User with ${decodedHeaders.user_id} not found`, 404); }

        // var entry = await this.fluidLoggingRepository.createQueryBuilder('fluid_logging')
        //     .where('user_id = :user_id', {user_id: decodedHeaders.user_id})
        //     .andWhere('logging_date = :logging_date', {logging_date: loggingDate})
        //     .getOne();

        // if (!entry || entry == null) {
        //     entry = new FluidLogging();

        //     entry.user = user_object;
            
        //     const remaining_fluid = user_object.daily_budget.water_intake - water_intake;

        //     entry.remaining_fluid = remaining_fluid;

        //     entry.logging_date = loggingDate;

        //     try{
        //         await this.fluidLoggingRepository.save(entry);  
        //     }
        //     catch (error){
        //         return new HttpException("Error logging fluid", 500);
        //     }
        //     return true;
        // }
        // else {
        //     return entry;
        // }
    }
}