import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { User } from 'src/user/user.entity';
import { EducationController } from './educational.controller';
import { EducationalService } from './educational.service';
import { CommonService } from 'src/common/common.service';

@Module({
    imports: [TypeOrmModule.forFeature([EducationalContent, User])],
    controllers: [EducationController],
    providers: [EducationalService, CommonService]
})
export class EducationalModule {}
