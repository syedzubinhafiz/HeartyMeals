import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealLoggingController } from './meal-logging.controller';
import { MealLoggingService } from './meal-logging.service';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/user/user.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { MealLogging } from './meal-logging.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Recipe, MealLogging])
    ],
    controllers: [MealLoggingController],
    providers: [MealLoggingService, CommonService]
})
export class MealLoggingModule {}
