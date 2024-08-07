import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/user/user.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Storage, User])],
    controllers: [StorageController],
    providers: [StorageService, CommonService]
})
export class StorageModule {}
