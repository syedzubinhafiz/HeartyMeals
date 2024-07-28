import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { Country } from 'src/country/country.entity';
import { Dietary } from 'src/dietary/dietary.entitry';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Country, Dietary])],
    controllers: [UserController],
    providers: [UserService],  
})
export class UserModule {}
