import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuisineController } from './cuisine.controller';
import { Cuisine } from './cuisine.entity';
import { CuisineService } from './cuisine.service';
import { Country } from 'src/country/country.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Cuisine, Country])],
    controllers: [CuisineController],
    providers: [CuisineService]
})
export class CuisineModule {}
