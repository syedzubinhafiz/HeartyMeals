import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FluidLogging } from './fluid-logging.entity';
import { FluidLoggingController } from './fluid-logging.controller';
import { FluidLoggingService } from './fluid-logging.service';
import { User } from 'src/user/user.entity';
import { CommonService } from 'src/common/common.service';
import { UserService } from 'src/user/user.service';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FluidLogging, User, Country, Dietary, Ethnicity])],
    controllers: [FluidLoggingController],
    providers: [FluidLoggingService, CommonService, UserService]
})
export class FluidLoggingModule {}
