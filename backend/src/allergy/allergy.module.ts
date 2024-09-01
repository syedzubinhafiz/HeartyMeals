import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodCategory } from 'src/food-category/foodCategory.entity';
import { User } from 'src/user/user.entity';
import { UserAllergyService } from './user_allergy.service';
import { UserAllergyController } from './user_allergy.controller';
import { UserAllergy } from './user_allergy.entity';
import { CommonService } from 'src/common/common.service';
import { UserService } from 'src/user/user.service';
import { Country } from 'src/country/country.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { Dietary } from 'src/dietary/dietary.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, FoodCategory, UserAllergy, Country, Ethnicity, Dietary])
    ],
    controllers: [UserAllergyController],
    providers: [UserAllergyService, CommonService, UserService],
})
export class AllergiesModule {}
