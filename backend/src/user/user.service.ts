import { Injectable } from '@nestjs/common';
import { CreatUserDTO } from './dto/create-user-dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entitry';
import { UserRole } from './enum/user-role.enum';
import { CreatAdminDTO } from './dto/create-admin-dto';
import { stringify } from 'querystring';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
        @InjectRepository(Dietary)
        private dietaryRepository: Repository<Dietary>
    ){}

    
    async createNewUser(payload: CreatUserDTO, userRole: UserRole){
        const new_user = new User();

        new_user.gsh_user_id = payload.gshUserId;
        new_user.user_role =  userRole;
        new_user.country = await this.countryRepository.findOneBy({id: payload.countryId});
        new_user.dietary = await this.dietaryRepository.findOneBy({id: payload.dietaryId});
        new_user.nyha_level = payload.nyhaLevel;
        new_user.name = payload.name;
        new_user.email = payload.email;

        return await this.userRepository.save(new_user);
    }

    async createNewAdmin(payload: CreatAdminDTO, userRole: UserRole){
        const new_user = new User();

        new_user.gsh_user_id = payload.gshUserId;
        new_user.user_role =  userRole;
        new_user.name = payload.name;
        new_user.email = payload.email;
        new_user.country = null;
        new_user.dietary = null;
        new_user.nyha_level = null;
        new_user.medical_info = JSON.parse("{}");
        
        return await this.userRepository.save(new_user);
    }
}
