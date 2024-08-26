import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([User, Country, Dietary, Ethnicity])
    ],
    controllers: [UserController],
    providers: [UserService, CommonService],  
})
export class UserModule {}
