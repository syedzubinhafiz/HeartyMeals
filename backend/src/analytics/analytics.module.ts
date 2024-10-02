import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealLogSummary } from 'src/meal-log-summary/meal-log-summary.entity';
import { MealLogging } from 'src/meal-logging/meal-logging.entity';
import { User } from 'src/user/user.entity';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [TypeOrmModule.forFeature([MealLogSummary, MealLogging, User])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, CommonService]
})
export class AnalyticsModule {}
