import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealLogSummaryService } from './meal-log-summary.service';
import { MealLogSummary } from './meal-log-summary.entity';
import { MealLogSummaryController } from './meal-log-summary.controller';
import { User } from 'src/user/user.entity';
import { CommonService } from 'src/common/common.service';
import { MealLogging } from 'src/meal-logging/meal-logging.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { MealLoggingService } from 'src/meal-logging/meal-logging.service';

@Module({
    imports: [TypeOrmModule.forFeature([MealLogSummary, User, MealLogging, Recipe, Country, Dietary, Ethnicity, ])],
    controllers: [MealLogSummaryController, UserController],
    providers: [MealLogSummaryService, CommonService, UserService, MealLoggingService],
})
export class MealLogSummaryModule {}
