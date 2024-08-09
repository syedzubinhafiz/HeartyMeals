import { Body, Controller, Post, Headers, Get, HttpException } from '@nestjs/common';
import { CreatUserDTO } from './dto/create-user-dto';
import { UserService } from './user.service';
import { Gender } from './enum/gender.enum';


@Controller('user')
export class UserController {
    
    constructor(
        private userService: UserService
    ){}

    @Post('signup')
    async createUser(@Body() createUserDTO: CreatUserDTO, @Headers() headers) {
        const authHeader = headers.authorization;
        const decodedHeaders = this.userService.decodeHeaders(authHeader);

        return await this.userService.createNewUser(createUserDTO,decodedHeaders);
    }

    @Post('signup/admin')
    async createAdmin(@Headers() headers, @Body('gender') gender: string) {
    
        let genderEnum: Gender;
        switch (gender){
            case "Male":
                genderEnum = Gender.MALE;
                break;
            case "Female":
                genderEnum =  Gender.FEMALE;
                break;
            default:
                return new HttpException("Gender not valid", 400);
        }
        
        const authHeader = headers.authorization;
        const decodedHeaders = this.userService.decodeHeaders(authHeader);

        return await this.userService.createNewAdmin(genderEnum, decodedHeaders);
    }

    @Get('verify')
    async verifyUser(@Headers() headers) {

        const authHeader = headers.authorization;
        const decodedHeaders = this.userService.decodeHeaders(authHeader);

        return await this.userService.verifyUser(decodedHeaders);
  }
}
