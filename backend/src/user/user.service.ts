import { Injectable } from '@nestjs/common';
import { CreatUserDTO } from './dto/create-user-dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entitry';
import { UserRole } from './enum/user-role.enum';
import { CreatAdminDTO } from './dto/create-admin-dto';
import * as jwt from 'jsonwebtoken';

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

        new_user.user_role =  userRole;
        new_user.country = await this.countryRepository.findOneBy({id: payload.countryId});
        new_user.dietary = await this.dietaryRepository.findOneBy({id: payload.dietaryId});
        new_user.nyha_level = payload.nyhaLevel;
        new_user.email = payload.email;

        return await this.userRepository.save(new_user);
    }

    async createNewAdmin(payload: CreatAdminDTO, userRole: UserRole){
        const new_user = new User();

        new_user.user_role =  userRole;
        new_user.email = payload.email;
        new_user.country = null;
        new_user.dietary = null;
        new_user.nyha_level = null;
        new_user.medical_info = JSON.parse("{}");
        
        return await this.userRepository.save(new_user);
    }

    async verifyUser( authHeader: string) {

        if (!authHeader) {
            throw new Error('Authorization header not found');
        }
    
        const token = authHeader.split(' ')[1];
        if (!token) {
        throw new Error('Token not found');
        }

        try {
            const decoded = jwt.decode(token);
    
            const user = await this.userRepository.findOneBy({user_id:decoded['sid']});
    
            if (user !== null){
                return user;
            } else {
                return false; 
            }

        } catch (error) {
        throw new Error('Invalid token');
        }

    }
}
