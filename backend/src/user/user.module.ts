import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { MealLogSummary } from 'src/meal-log-summary/meal-log-summary.entity';
import { MealLogSummaryController } from 'src/meal-log-summary/meal-log-summary.controller';
import { MealLogSummaryService } from 'src/meal-log-summary/meal-log-summary.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([User, Country, Dietary, Ethnicity, MealLogSummary])
    ],
    controllers: [UserController],
    providers: [UserService, CommonService, MealLogSummaryService],
})
export class UserModule {}
