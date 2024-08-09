import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EducationalService } from './educational.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EducationalContentDTO } from './dto/edu-content-dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { UserRole } from 'src/user/enum/user-role.enum';

@Controller('education')
export class EducationController {
    constructor(
        private educationalContentService: EducationalService,
        private userRepository: Repository<User>,
    ){}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files[]'))
    async upload(@Body('data') payload: EducationalContentDTO, @UploadedFiles() files: Array<Express.Multer.File>){
        let user = await this.userRepository.findOne({
            where: {
                user_id: payload.userId
            }
        });
        
        if (user.user_role !=  UserRole.ADMIN){
            return "Error: Must be admin to be able to upload educational content.";
        }

        return this.educationalContentService.uploadContent(payload.title, payload.content, files);
    }
}
