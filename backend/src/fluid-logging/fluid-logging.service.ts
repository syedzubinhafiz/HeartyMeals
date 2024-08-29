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
    
    async getFluidLogging(decodedHeaders: any, loggingDate: Date){
        // get user object
        const user_object = await this.userRepository.findOneBy({user_id: decodedHeaders.user_id});
        if (!user_object || user_object == null) { return new HttpException(`User with ${decodedHeaders.user_id} not found`, 404); }

        // check for valid date format
        const date_pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}$/;
        if (!loggingDate || !date_pattern.test(loggingDate.toString())) { return new HttpException("Invalid date format. date must be in the format YYYY-MM-DDTHH:MM:SS.SSS+-HHMM", 400); }

        // TODO: validate the date is not in the future or in the past

        // get the fluid logging entry for the user on the given date and userid
        var entry = await this.fluidLoggingRepository.createQueryBuilder('fluid_logging')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('logging_date = :logging_date', {logging_date: loggingDate})
            .getOne();

        // if the entry does not exist, means today water intake is not logged yet, create a new entry
        if (!entry || entry == null) {
            entry = new FluidLogging();

            entry.user = user_object;

            entry.remaining_fluid = user_object.daily_budget["water_intake"];

            entry.logging_date = loggingDate;

            try{
                await this.fluidLoggingRepository.save(entry);  
            }
            catch (error){
                return new HttpException("Error logging fluid", 500);
            }
            return true;
        }
        else {
            return entry;
        }
    }

    async updateFluidLogging(decodedHeaders: any, payload: any){
        // get user object
        const user_object = await this.userRepository.findOneBy({user_id: decodedHeaders.user_id});
        if (!user_object || user_object == null) { return new HttpException(`User with ${decodedHeaders.user_id} not found`, 404); }

        // check for valid date format
        const date_pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}$/;
        if (!payload.loggingDate || !date_pattern.test(payload.loggingDate.toString())) { return new HttpException("Invalid date format. date must be in the format YYYY-MM-DDTHH:MM:SS.SSS+-HHMM", 400); }

        // check wter intake is not negative
        if (payload.water_intake < 0) { return new HttpException("Water intake cannot be negative", 400); }

        // get the fluid logging entry for the user on the given date and userid
        var entry = await this.fluidLoggingRepository.createQueryBuilder('fluid_logging')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('logging_date = :logging_date', {logging_date: payload.loggingDate})
            .getOne();

        entry.remaining_fluid = entry.remaining_fluid - payload.water_intake;
        try{
            await this.fluidLoggingRepository.save(entry);  
        }
        catch (error){
            return new HttpException("Error logging fluid", 500);
        }
        return true;
    }
}