import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealLogSummaryService } from './meal-log-summary.service';
import { MealLogSummary } from './meal-log-summary.entity';
import { MealLogSummaryController } from './meal-log-summary.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MealLogSummary])],
    controllers: [MealLogSummaryController],
    providers: [MealLogSummaryService],
})
export class MealLogSummaryModule {}
