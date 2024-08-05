import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EducationalService } from './educational.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('education')
export class EducationController {
    constructor(private educationalContentService: EducationalService){}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('file'))
    upload(@Body('data') payload: string, @UploadedFiles() file: Array<Express.Multer.File>){
        // parse the data from string to json 
        const data = JSON.parse(payload);

        return this.educationalContentService.uploadContent();
    }
}
