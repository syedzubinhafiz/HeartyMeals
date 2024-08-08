import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { User } from 'src/user/user.entity';
import { EducationController } from './educational.controller';
import { EducationalService } from './educational.service';
import { CommonService } from 'src/common/common.service';
import { StorageService } from 'src/storage/storage.service';
import { Storage } from 'src/storage/storage.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EducationalContent, User, Storage])],
    controllers: [EducationController],
    providers: [EducationalService, CommonService, StorageService]
})
export class EducationalModule {}
