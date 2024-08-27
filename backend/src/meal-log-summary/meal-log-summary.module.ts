import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealLogSummaryService } from './meal-log-summary.service';
import { MealLogSummary } from './meal-log-summary.entity';
import { MealLogSummaryController } from './meal-log-summary.controller';
import { User } from 'src/user/user.entity';
import { CommonService } from 'src/common/common.service';
import { MealLogging } from 'src/meal-logging/meal-logging.entity';
import { Recipe } from 'src/recipe/recipe.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MealLogSummary, User, MealLogging, Recipe])],
    controllers: [MealLogSummaryController],
    providers: [MealLogSummaryService, CommonService],
})
export class MealLogSummaryModule {}
