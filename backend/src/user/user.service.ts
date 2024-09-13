import { Gender } from './enum/gender.enum';
import { HttpException, Injectable } from '@nestjs/common';
import { CreatUserDTO } from './dto/create-user-dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { UserRole } from './enum/user-role.enum';
import { CommonService } from 'src/common/common.service';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { CreateAdminDTO } from './dto/create-admin-dto';
import { NutritionSettingDTO } from './dto/nutrition-setting-dto';
import { CholesterolLevel } from './enum/cholesterol.enum';

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

    
    async createNewUser(payload: CreatUserDTO, decodedHeaders: any){
        const new_user = new User();
        if (await this.userRepository.findOneBy({user_id:decodedHeaders['sub']})){
            return new HttpException("User already exists", 400);
        }

        if (payload.userNutritionSetting.carbsPercentage + payload.userNutritionSetting.proteinPercentage + payload.userNutritionSetting.fatPercentage != 1){
            return new HttpException("Nutrition percentages should add up to 100%", 400);
        }

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

        return await this.userRepository.save(new_user);
    }

    async createNewAdmin(payload:CreateAdminDTO, decodedHeaders: any){

        if (await this.userRepository.findOneBy({user_id:decodedHeaders['sub']})){
            return new HttpException("User already exists", 400);
        }

        const new_user = new User();

        new_user.user_role =  UserRole.ADMIN;
        new_user.user_id = decodedHeaders['sub'];
        new_user.email = decodedHeaders['email'];
        new_user.first_name =  decodedHeaders['given_name'];
        new_user.last_name = decodedHeaders['family_name'];
        new_user.ethnicity = null;
        new_user.gender = payload.gender
        new_user.country = null;
        new_user.dietary = null;
        new_user.nyha_level = null;
        new_user.age = 0;
        new_user.height = 0;
        new_user.weight = 0;
        new_user.medical_info = JSON.parse("{}");
        
        return await this.userRepository.save(new_user);
    }

    async verifyUser( decoded: any) {
    
        const user = await this.userRepository.findOneBy({user_id:decoded['sub']});

        if (user !== null){
            return true;
        } else {
            return false; 
        }
    }

   

}
