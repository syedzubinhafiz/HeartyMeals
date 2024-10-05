import { Body, Controller, Post, Headers, Get, HttpException, Query } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UserService } from './user.service';
import { Gender } from './enum/gender.enum';
import { CommonService } from 'src/common/common.service';
import { CreateAdminDTO } from './dto/create-admin-dto';
import { MealLogSummaryService } from 'src/meal-log-summary/meal-log-summary.service';


@Controller('user')
export class UserController {
    
    constructor(
        private userService: UserService,
        private commonService: CommonService,
        private mealLogSummaryService: MealLogSummaryService,
    ){}

    /**
     *  This endpoint is used to create a new patient user
     * @param createUserDTO patient user data
     * @param headers authorization header containing the user id, email and name
     * @returns the newly created user
     */
    @Post('signup')
    async createUser(@Body() createUserDTO: CreateUserDTO, @Headers() headers) {
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        return await this.userService.createNewUser(createUserDTO,decodedHeaders);
    }

    /**
     * This endpoint is used to create a new admin user
     * @param headers authorization header containing the user id, email and name
     * @param payload admin user data
     * @returns the status of the creation
     */
    @Post('signup/admin')
    async createAdmin(@Headers() headers, @Body() payload: CreateAdminDTO ) {
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        return await this.userService.createNewAdmin(payload, decodedHeaders);
    }

    /**
     * This endpoint is used to verify a user
     * @param headers authorization header containing the user id
     * @returns True if the user is verified, False otherwise
     */
    @Get('verify')
    async verifyUser(@Headers() headers) {

        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        return await this.userService.verifyUser(decodedHeaders);
  }

  @Get('verify/admin')
  async verifyAdmin(@Headers() headers) {
    
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);
    
        return await this.userService.verifyAdmin(decodedHeaders);
  }
  
  
  /**
   * This endpoint is used to get the remaining budget of a user
   * @param headers authorization header containing the user id
   * @param startDate date that the user wants to get the remaining budget for
   * @param timeZone  time zone of the user
   * @returns the remaining budget of the user
   */
  @Get('budget')
    async getRemainingBudget(@Headers() headers, @Query("startDate") startDate: string, @Query("timeZone") timeZone: string){
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        try {
            return this.mealLogSummaryService.getRemainingBudget(decodedHeaders, startDate, null, timeZone, null);
        } catch (e){
            return new HttpException(e.message, 400)
        }
    }


    /**
     * This endpoint is used to get the user information
     * @param headers authorization header containing the user id
     * @returns the user information
     */
    @Get('info')
    async getUserInfo(@Headers() headers){
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        return await this.userService.getUserInfo(decodedHeaders);
    }


    /**
     * This endpoint is used to update the user information
     * @param headers authorization header containing the user id
     * @param payload updated user information
     * @returns the updated user information
     */
    @Post('update')
    async updateUser(@Headers() headers, @Body() payload: CreateUserDTO) {
        const authHeader = headers.authorization;
        const decodedHeaders = this.commonService.decodeHeaders(authHeader);

        return await this.userService.updateUserInfo(decodedHeaders, payload);
    }
}
