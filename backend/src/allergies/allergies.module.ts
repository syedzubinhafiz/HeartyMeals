import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodCategory } from 'src/food-category/foodCategory.entity';
import { User } from 'src/user/user.entity';
import { UserAllergyService } from './user_allergy.service';
import { UserAllergyController } from './user_allergy.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User,FoodCategory])
    ],
    controllers: [UserAllergyController],
    providers: [UserAllergyService],
})
export class AllergiesModule {}
