import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealLoggingController } from './meal-logging.controller';
import { MealLoggingService } from './meal-logging.service';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/user/user.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { MealLogging } from './meal-logging.entity';
import { MealPlanningController } from './meal-planning.controller';
import { UserService } from 'src/user/user.service';
import { MealLogSummary } from 'src/meal-log-summary/meal-log-summary.entity';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { MealLogSummaryService } from 'src/meal-log-summary/meal-log-summary.service';
import { StorageService } from 'src/storage/storage.service';
import { Storage } from 'src/storage/storage.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MealLogSummary, User, MealLogging, Recipe, Country, Dietary, Ethnicity, Storage])
    ],
    controllers: [MealLoggingController, MealPlanningController],
    providers: [MealLoggingService, CommonService, UserService, MealLogSummaryService, StorageService]
})
export class MealLoggingModule {}
