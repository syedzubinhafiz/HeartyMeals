import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FluidLogging } from './fluid-logging.entity';
import { FluidLoggingController } from './fluid-logging.controller';
import { FluidLoggingService } from './fluid-logging.service';
import { User } from 'src/user/user.entity';
import { CommonService } from 'src/common/common.service';

@Module({
    imports: [TypeOrmModule.forFeature([FluidLogging, User])],
    controllers: [FluidLoggingController],
    providers: [FluidLoggingService, CommonService]
})
export class FluidLoggingModule {}
