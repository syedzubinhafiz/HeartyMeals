import { Body, Controller, Post } from '@nestjs/common';
import { CreatUserDTO } from './dto/create-user-dto';
import { UserService } from './user.service';
import { UserRole } from './enum/user-role.enum';
import { CreatAdminDTO } from './dto/create-admin-dto';

@Controller('user')
export class UserController {
    
    constructor(
        private userService: UserService
    ){}

    @Post('new')
    async createNewPatient(@Body() payload: CreatUserDTO){
        return await this.userService.createNewUser(payload, UserRole.PATIENT)
    }

    @Post('new/admin')
    async createNewAdmin(@Body() payload: CreatAdminDTO){
        return await this.userService.createNewAdmin(payload, UserRole.ADMIN)
    }

    @Post('new/dietitian')
    async createNewDietitian(@Body() payload: CreatAdminDTO){
        return await this.userService.createNewAdmin(payload, UserRole.DIETITIAN)
    }
}
