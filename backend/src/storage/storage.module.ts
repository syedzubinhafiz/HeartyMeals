import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { CommonService } from 'src/common/common.service';


@Module({
    imports: [TypeOrmModule.forFeature([Storage])],
    controllers: [StorageController],
    providers: [StorageService, CommonService]
})
export class StorageModule {}
