import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { User } from 'src/user/user.entity';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Storage, User, Country, Dietary, Ethnicity])],
    controllers: [StorageController],
    providers: [StorageService]
})
export class StorageModule {}
