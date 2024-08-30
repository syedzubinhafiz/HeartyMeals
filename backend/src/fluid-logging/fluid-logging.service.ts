import { InjectRepository } from "@nestjs/typeorm";
import { FluidLogging } from "./fluid-logging.entity";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { HttpException } from "@nestjs/common";
import { UpdateFluidLoggingDTO } from "./dto/update-fluid-logging-dto";
import { CommonService } from "src/common/common.service";
import { UserService } from "src/user/user.service";

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
    async getFluidLogging(decodedHeaders: any, loggingDate: string){
        // validate user id
        if (!this.userService.verifyUser(decodedHeaders)) { return new HttpException(`User with id ${decodedHeaders['sub']} not found.`, 400); }
        const user_object = await this.userRepository.findOneBy({user_id: decodedHeaders.user_id});

        // date validation
        if (!this.commonService.validateDate(loggingDate)) { return new HttpException("Invalid date format. Date must be in YYYY-MM-DDTHH:MM:SS.SSS+-HHMM format.", 400); }
        const logging_date = new Date(loggingDate.split('T')[0]);

        // get the fluid logging entry for the user on the given date and userid
        var entry = await this.fluidLoggingRepository.createQueryBuilder('fluid_logging')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('logging_date = :logging_date', {logging_date: loggingDate})
            .getOne();

        // if the entry does not exist, means today water intake is not logged yet, create a new entry
        if (!entry || entry == null) {
            entry = new FluidLogging();

            entry.user = user_object;

            var new_record = {} as JSON;
            new_record["date"] = loggingDate;
            new_record["remaining_fluid"] = user_object.daily_budget["water_intake"];

            entry.remaining_fluid = [new_record];

            entry.logging_date = new Date(logging_date);

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

        // date validation
        const logging_date = new Date(updateFluidLoggingDTO.loggingDate);
        const today = new Date();
        if (!this.commonService.isSameDay(logging_date, today)) { throw new HttpException("You can only log fluid intake for today.", 400); }

        // get the fluid logging entry for the user on the given date and userid
        var entry = await this.fluidLoggingRepository.createQueryBuilder('fluid_logging')
            .where('user_id = :user_id', {user_id: user_object.user_id})
            .andWhere('logging_date = :logging_date', {logging_date: logging_date.toISOString().split('T')[0]})
            .getOne();

        // deduct from the latest record
        const previous_remaining_fluid_record = entry.remaining_fluid[entry.remaining_fluid.length - 1];
        const remaining_fluid = previous_remaining_fluid_record["remaining_fluid"] - updateFluidLoggingDTO.waterIntake

        const latest_remaining_fluid = {} as JSON;
        latest_remaining_fluid["date"] = updateFluidLoggingDTO.loggingDate;
        latest_remaining_fluid["remaining_fluid"] = remaining_fluid;

        // save to the array
        entry.remaining_fluid.push(latest_remaining_fluid);

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