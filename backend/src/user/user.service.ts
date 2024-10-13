import { Gender } from './enum/gender.enum';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { UserRole } from './enum/user-role.enum';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { CreateAdminDTO } from './dto/create-admin-dto';
import { NutritionSettingDTO } from './dto/nutrition-setting-dto';
import { CholesterolLevel } from './enum/cholesterol.enum';
import { CommonService } from 'src/common/common.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
        @InjectRepository(Dietary)
        private dietaryRepository: Repository<Dietary>,
        @InjectRepository(Ethnicity)
        private ethnicityRepository: Repository<Ethnicity>,
        private commonService: CommonService,
    ){}


    /**
     * This function creates a new patient user
     * @param payload user data
     * @param decodedHeaders decoded headers containing user id, email, first name and last name 
     * @returns new user
     */
    async createNewUser(payload: CreateUserDTO, decodedHeaders: any){

        const new_user = new User();

        // check if the user already exists
        if (await this.userRepository.findOneBy({user_id:decodedHeaders['sub']})){
            return new HttpException("User already exists", 400);
        }

        // check if the nutrition percentages add up to 100
        if (payload.userNutritionSetting.carbsPercentage + payload.userNutritionSetting.proteinPercentage + payload.userNutritionSetting.fatPercentage != 1){
            return new HttpException("Nutrition percentages should add up to 100%", 400);
        }

        // fill in the user data
        new_user.user_role =  UserRole.PATIENT;
        new_user.user_id = decodedHeaders['sub'];
        new_user.country = await this.countryRepository.findOneBy({id: payload.countryId});
        new_user.dietary = await this.dietaryRepository.findOneBy({id: payload.dietaryId});
        new_user.nyha_level = payload.nyhaLevel;
        new_user.email = decodedHeaders['email'];
        new_user.first_name =  decodedHeaders['given_name'];
        new_user.last_name = decodedHeaders['family_name'];
        new_user.gender = payload.gender
        new_user.ethnicity = await this.ethnicityRepository.findOneBy({id: payload.ethnicityId});
        new_user.medical_info = payload.medicalInfo;

        new_user.age = payload.age;
        new_user.height = payload.height;
        new_user.weight = payload.weight;

        new_user.user_nutrition_setting = {
            'carbs_percentage': payload.userNutritionSetting.carbsPercentage,
            'protein_percentage': payload.userNutritionSetting.proteinPercentage,
            'fat_percentage': payload.userNutritionSetting.fatPercentage,
            'cholesterol_level': payload.userNutritionSetting.cholesterolLevel,
            'activity_level': payload.userNutritionSetting.activityLevel,
        }
        payload.userNutritionSetting;

        // calculate the daily budget for the user in the format below
        // {
        //     "calories": 0, //in kcal
        //     "carbs": 0, //in g
        //     "protein": 0, //in g
        //     "fat": 0, //in g
        //     "sodium": 0, //in mg
        //     "cholesterol": 0, //in mg
        //     "water_intake": 0 //in ml
        // }
        // call common service to get the daily calories required for the user
        const user_daily_calories = this.commonService.calculateCalories(payload.gender, payload.age, payload.height, payload.weight, payload.userNutritionSetting);

        // call common service to calculate the daily nutrition budget for the user
        var user_daily_budget = this.commonService.calculateNutritionBudget(user_daily_calories, payload.userNutritionSetting, payload.nyhaLevel);

        new_user.daily_budget = user_daily_budget;

        // save the user to the database
        await this.userRepository.save(new_user);

        return { message: "User created successfully", status: 200};
    }

    /**
     * This function creates a new admin user
     * @param payload admin information
     * @param decodedHeaders decoded headers containing the user id of the user creating the admin
     * @returns  response message of the creation status
     */
    async createNewAdmin(payload:CreateAdminDTO, decodedHeaders: any){

        // check if the user creating the admin is an admin
        const admin_user = await this.userRepository.findOneBy({user_id:decodedHeaders['sub']});

        // check if the user creating the admin exists 
        if (admin_user === null){

            // allow the user to create an admin if there are no admins in the database
            if(await this.userRepository.countBy({user_role: UserRole.ADMIN}) !== 0){
                return new HttpException("Admin not found !", 400);
            }

        // check if the user creating the admin is not an admin
        } else if (admin_user.user_role !== UserRole.ADMIN) {
            return new HttpException("User does not have permission to add new admin !", 400)

        // check if the admin already exists    
        } else if(await this.userRepository.findOneBy({email:payload.email})){
            return new HttpException("Admin already exists", 400);
        }

        // fill in the admin data
        const new_user = new User();

        new_user.user_role =  UserRole.ADMIN;
        new_user.user_id = uuidv4();
        new_user.email = payload.email;
        new_user.first_name = payload.first_name;
        new_user.last_name = payload.last_name; 
        new_user.ethnicity = null;
        new_user.gender = payload.gender
        new_user.country = null;
        new_user.dietary = null;
        new_user.nyha_level = null;
        new_user.age = 0;
        new_user.height = 0;
        new_user.weight = 0;
        new_user.medical_info = JSON.parse("{}");
        
        await this.userRepository.save(new_user);
        return new HttpException("Admin created successfully", 200);
    }

    /**
     * This function verifies the user exists in the database
     * @param decoded decoded headers containing the user id
     * @returns true if the user exists, false otherwise
     */
    async verifyUser( decoded: any) {
    
        // check if the user exists in the database
        const user = await this.userRepository.findOneBy({user_id: decoded['sub']});

        // if the user exists return true
        if (user !== null){
            return true;
        } else {

            //try to find the user by email and update the user_id to the new user_id if it is a newly created admin
            const new_admin_user =  await this.userRepository.findOneBy({email: decoded['email']});
            if (new_admin_user !== null){
                const old_user_id = new_admin_user.user_id;
                new_admin_user.user_id = decoded['sub'];
                // update the user_id to the new user_id
                await this.userRepository.save(new_admin_user);
                await this.userRepository.delete({user_id: old_user_id});
                return true;
            }
            return false; 
        }
    }

    /**
     * This function verifies the admin exists in the database
     * @param decoded decoded headers containing the user id
     * @returns true if the admin exists, false otherwise
     */
    async verifyAdmin(decoded: any) {

        // check if the user exists in the database
        const user = await this.userRepository.findOneBy({user_id: decoded['sub']});

        // if the user exists return true
        if (user !== null && user.user_role === UserRole.ADMIN){
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * This function gets the user information from the database
     * @param decoded decoded headers containing the user id
     * @returns    user information else an error message
     */
    async getUserInfo(decoded: any){

        const user = await this.userRepository.findOneBy({user_id: decoded['sub']});

        if (user === null){
            return new HttpException("User not found", 400);
        }

        return user;
    }

    /**
     * This function updates the user information in the database
     * @param decodede decoded headers containing the user id
     * @param payload user information to be updated
     * @returns updated user information else an error message
     */
    async updateUserInfo( decodede: any, payload: CreateUserDTO){

        // check if the user exists in the database
        const user = await this.userRepository.findOneBy({user_id: decodede['sub']});

        // if the user does not exist return an error message
        if (user === null){
            return new HttpException("User not found", 400);
        }

        let change_flag =  false;

        // check if the user wants to change the country
        const new_country = await this.countryRepository.findOneBy({id: payload.countryId});
        if (new_country === null){
            return new HttpException("Selected country not found", 400);
        } else if (user.country.id !== new_country.id){
            user.country = new_country;
            change_flag = true;
        }

        // check if the user wants to change the dietary
        const new_dietary = await this.dietaryRepository.findOneBy({id: payload.dietaryId});
        if (new_dietary === null){
            return new HttpException("Selected dietary not found", 400);
        } else if (user.dietary.id !== new_dietary.id){
            user.dietary = new_dietary;
            change_flag = true;
        }

        // check if the user wants to change the ethnicity
        const new_ethnicity = await this.ethnicityRepository.findOneBy({id: payload.ethnicityId});
        if (new_ethnicity === null){
            return new HttpException("Selected ethnicity not found", 400);
        } else if (new_ethnicity.id !== user.ethnicity.id) {
            user.ethnicity = new_ethnicity;
            change_flag = true;
        }

        // check if the user wants to change their gender
        if(payload.gender !== user.gender){
            user.gender =  payload.gender,
            change_flag = true;
        }

        // check if the user wants to change their age
        if(payload.age !== user.age){
            user.age = payload.age;
            change_flag = true;
        }

        // check if the user wants to change their height
        if (payload.height !== user.height){
            user.height = payload.height;
            change_flag = true;
        }

        // check if the user wants to change their weight
        if (payload.weight !== user.weight){
            user.weight = payload.weight;
            change_flag = true;
        }

        // check if the user wants to change their nyha level
        if (payload.nyhaLevel !== user.nyha_level){
            user.nyha_level = payload.nyhaLevel;
            change_flag = true;
        }

        // check if the user wants to change their medical information
        if (user.medical_info !== payload.medicalInfo){
            user.medical_info = payload.medicalInfo;
            change_flag = true;
        }

        // check if the total nutrition percentages add up to 100
        if (payload.userNutritionSetting.carbsPercentage + payload.userNutritionSetting.proteinPercentage + payload.userNutritionSetting.fatPercentage != 1){
            return new HttpException("Nutrition percentages should add up to 100%", 400);
        }


        const user_nutrition_setting = {
            'carbs_percentage': payload.userNutritionSetting.carbsPercentage,
            'protein_percentage': payload.userNutritionSetting.proteinPercentage,
            'fat_percentage': payload.userNutritionSetting.fatPercentage,
            'cholesterol_level': payload.userNutritionSetting.cholesterolLevel,
            'activity_level': payload.userNutritionSetting.activityLevel,
        }
        
        // check if the user wants to change their nutrition setting
        let user_nutrition_setting_flag = false;
        for (const key in user_nutrition_setting){
            if (user_nutrition_setting[key] !== user.user_nutrition_setting[key]){
                user_nutrition_setting_flag = true;
                change_flag = true;
                break;
            }
        }

        if (user_nutrition_setting_flag){
            user.user_nutrition_setting = user_nutrition_setting;
        }

        
        // calculate the daily budget for the user with the new information
        const user_daily_calories = this.commonService.calculateCalories(payload.gender, payload.age, payload.height, payload.weight, payload.userNutritionSetting);

        // call common service to calculate the daily nutrition budget for the user
        var user_daily_budget = this.commonService.calculateNutritionBudget(user_daily_calories, payload.userNutritionSetting, payload.nyhaLevel);
        let user_daily_budget_flag = false;

        // check if the user's daily budget has changed
        for (const key in user_daily_budget){
            if (user_daily_budget[key] !== user.daily_budget[key]){
                user_daily_budget_flag = true;
                change_flag = true; 
                break;
            }
        }


        if (user_daily_budget_flag){
            user.daily_budget = user_daily_budget;
        }

        // save the user to the database if there are changes
        if (change_flag){ 
            await this.userRepository.save(user);
        }
        return user;

    }
}
