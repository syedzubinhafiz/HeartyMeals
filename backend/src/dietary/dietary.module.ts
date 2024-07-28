import { Module } from '@nestjs/common';
import { Dietary } from './dietary.entitry';
import { DietaryController } from './dietary.controller';
import { DietaryService } from './dietary.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Dietary])],
    controllers: [DietaryController],
    providers: [DietaryService]
})
export class DietaryModule {}
