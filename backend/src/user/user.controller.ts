import { Body, Controller, Post, Headers, Get, HttpException } from '@nestjs/common';
import { CreatUserDTO } from './dto/create-user-dto';
import { UserService } from './user.service';
import { Gender } from './enum/gender.enum';
import { CommonService } from 'src/common/common.service';
import { CreateAdminDTO } from './dto/create-admin-dto';
import { DateValidationDTO } from 'src/common/dto/date-validation-dto';
import { MealLogSummaryService } from 'src/meal-log-summary/meal-log-summary.service';


@Controller('user')
export class UserController {
    
    constructor(
        private userService: UserService,
        private commonService: CommonService,
        private mealLogSummaryService: MealLogSummaryService,
    ){}

    @Post('signup')
    async createUser(@Body() createUserDTO: CreatUserDTO, @Headers() headers) {
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        return await this.userService.createNewUser(createUserDTO,decodedHeaders);
    }

    @Post('signup/admin')
    async createAdmin(@Headers() headers, @Body() payload: CreateAdminDTO ) {
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        return await this.userService.createNewAdmin(payload, decodedHeaders);
    }

    @Get('verify')
    async verifyUser(@Headers() headers) {

        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        return await this.userService.verifyUser(decodedHeaders);
  }

}
