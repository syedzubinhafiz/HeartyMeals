import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EducationalService } from './educational.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EducationalContentDTO } from './dto/edu-content-dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { UserRole } from 'src/user/enum/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('education')
export class EducationController {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private educationalContentService: EducationalService,
    ){}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files[]'))
    async upload(@Body('data') payload, @UploadedFiles() files: Array<Express.Multer.File>){
        payload = JSON.parse(payload);
        try {
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
        catch (e){
            return e;
        }
    }

    @Post('delete')
    delete(@Body() payload){
        return this.educationalContentService.deleteContent(payload.eduId);
    }
}
