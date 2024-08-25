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
        private ethnicityRepository: Repository<Ethnicity>
    ){}

    
    async createNewUser(payload: CreatUserDTO, decodedHeaders: any){
        const new_user = new User();
        console.log(decodedHeaders)
        if (await this.userRepository.findOneBy({user_id:decodedHeaders['sub']})){
            return new HttpException("User already exists", 400);
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
        new_user.ethnicity = await this.ethnicityRepository.findOneBy({id: payload.ethnicityId});
        new_user.gender = payload.gender
        new_user.country = null;
        new_user.dietary = null;
        new_user.nyha_level = null;
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
