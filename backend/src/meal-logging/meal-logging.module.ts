import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealLoggingController } from './meal-logging.controller';
import { MealLoggingService } from './meal-logging.service';

@Module({
    imports: [TypeOrmModule.forFeature([])],
    controllers: [MealLoggingController],
    providers: [MealLoggingService]
})
export class MealLoggingModule {}
