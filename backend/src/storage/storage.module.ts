import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageService } from './storage.service';
import { SupabaseStorageService } from './supabase-storage.service';
import { User } from 'src/user/user.entity';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { StorageController } from './storage.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Storage, User, Country, Dietary, Ethnicity])],
    controllers: [StorageController],
    providers: [StorageService, SupabaseStorageService],
    exports: [StorageService, SupabaseStorageService]
})
export class StorageModule {}
