import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { User } from 'src/user/user.entity';
import { EducationController } from './educational.controller';
import { EducationalService } from './educational.service';
import { StorageService } from 'src/storage/storage.service';
import { Storage } from 'src/storage/storage.entity';
import { Repository } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([EducationalContent, User, Storage, Repository])],
    controllers: [EducationController],
    providers: [EducationalService, StorageService, Repository]
})
export class EducationalModule {}
