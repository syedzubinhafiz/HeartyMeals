import { InjectRepository } from "@nestjs/typeorm";
import { FluidLogging } from "./fluid-logging.entity";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { HttpException } from "@nestjs/common";
import { UpdateFluidLoggingDTO } from "./dto/update-fluid-logging-dto";
import { CommonService } from "src/common/common.service";
import { UserService } from "src/user/user.service";
import { formatInTimeZone } from "date-fns-tz";
export class FluidLoggingService {
    constructor(
        @InjectRepository(FluidLogging)
        private fluidLoggingRepository: Repository<FluidLogging>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private commonService: CommonService,
        private userService: UserService,
    ){}
    
    /**
     * Get the fluid logging given a date
     * @param decodedHeaders - decoded headers from the request
     * @param loggingDate - date of the fluid logging
     * @returns fluid logging entry for the user on the given date, if it does not exist, create a new entry and save as today date
     */
    async getFluidLogging(decodedHeaders: any, date: string, timeZone: string){
        // validate user id
        if (!this.userService.verifyUser(decodedHeaders)) { return new HttpException(`User with id ${decodedHeaders['sub']} not found.`, 400); }
        const user_object = await this.userRepository.findOneBy({user_id: decodedHeaders.user_id});

        // get the start and end of the day 
        const startOfDay = `${date.split('T')[0]} 00:00:00`;
        const endOfDay = `${date.split('T')[0]} 23:59:59`;

        // get the fluid logging entry for the user on the given date and userid
        // get the fluid logging entry for the user on the given date and userid
        var entry = await this.fluidLoggingRepository.createQueryBuilder('fluid_logging')
            .where('user_id = :user_id', { user_id: user_object.user_id })
            .andWhere('logging_date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: timeZone, startOfDay: startOfDay, endOfDay: endOfDay })
            .getOne();

        // if the entry does not exist, means today water intake is not logged yet, create a new entry
        if (!entry || entry == null) {
            entry = new FluidLogging();

            entry.user = user_object;

            const logging_date_utc = new Date(formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"));

            var new_record = {} as JSON;
            new_record["date"] = logging_date_utc;
            new_record["remaining_fluid"] = user_object.daily_budget["water_intake"];

            entry.remaining_fluid = user_object.daily_budget["water_intake"];

            entry.logging_history = [new_record];

            entry.logging_date = logging_date_utc;

            try {
                const new_entry = await this.fluidLoggingRepository.save(entry);  
                return new_entry;
            }
            catch (error){
                return new HttpException("Error logging fluid", 500);
            }
        }
        else {
            return entry;
        }
    }

    /**
     * Update the fluid logging record for the user
     * @param decodedHeaders - decoded headers from the request
     * @param updateFluidLoggingDTO - DTO containing the date and water intake
     * @returns [true, warning] if the fluid is logged successfully
     */
    async updateFluidLogging(decodedHeaders: any, updateFluidLoggingDTO: UpdateFluidLoggingDTO){
        // validate user id
        if (!this.userService.verifyUser(decodedHeaders)) { return new HttpException(`User with id ${decodedHeaders['sub']} not found.`, 400); }
        const user_object = await this.userRepository.findOneBy({user_id: decodedHeaders.user_id});

        // get the start and end of the day 
        const startOfDay = `${updateFluidLoggingDTO.loggingDateTime.split('T')[0]} 00:00:00`;
        const endOfDay = `${updateFluidLoggingDTO.loggingDateTime.split('T')[0]} 23:59:59`;

        // get the fluid logging entry for the user on the given date and userid
        var entry = await this.fluidLoggingRepository.createQueryBuilder('fluid_logging')
            .where('user_id = :user_id', { user_id: user_object.user_id })
            .andWhere('logging_date AT TIME ZONE :timeZone BETWEEN :startOfDay AND :endOfDay ', { timeZone: updateFluidLoggingDTO.timeZone, startOfDay: startOfDay, endOfDay: endOfDay })
            .getOne();

        // deduct from the latest record
        const previous_remaining_fluid_record = entry.logging_history[entry.logging_history.length - 1];
        const remaining_fluid = previous_remaining_fluid_record["remaining_fluid"] - updateFluidLoggingDTO.waterIntake

        const latest_remaining_fluid = {} as JSON;
        latest_remaining_fluid["date"] = updateFluidLoggingDTO.loggingDateTime;
        latest_remaining_fluid["remaining_fluid"] = remaining_fluid;

        entry.remaining_fluid = remaining_fluid;
        // save to the array history 
        entry.logging_history.push(latest_remaining_fluid);

        var warning = null;
        if (remaining_fluid < 0) { warning = `Warning: You have exceeded your daily water intake by ${remaining_fluid} ml.`; }

        try{
            await this.fluidLoggingRepository.save(entry);  
        }
        catch (error){
            return new HttpException("Error logging fluid", 500);
        }

        return [true, warning];
    }
}