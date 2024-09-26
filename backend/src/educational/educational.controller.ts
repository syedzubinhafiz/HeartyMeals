import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EducationalService } from './educational.service';
import { EducationalContent } from './educational.entity';

@Controller('education')
export class EducationController {
    constructor(
        private educationalContentService: EducationalService,
    ){}

    @Get('get')
    async get(
        @Query('educationalContentId') educationalContentId: string = null,
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
        @Query("search") search: string = null,
    ){
        // Get the page number and page size
        const page_number = page != undefined ? parseInt(page, 10) : 0;
        const page_size = pageSize != undefined ? parseInt(pageSize, 10) : 0;

        // Check if pagination is required
        let pagination =  false;
        if (page_number != 0 && page_size != 0){
            pagination = true
        }

        const [educational_contents, total_educational_content] = await this.educationalContentService.getEducationalContent(
            page_number, 
            page_size, 
            search, 
            pagination,
            educationalContentId
        )
        // Return the educational content list or educational content details based on the pagination
        if (page_number != 0 && page_size != 0){
            return {
                data: educational_contents,
                page_number,
                page_size,
                total_educational_content,
                totalPages: Math.ceil(total_educational_content / page_size)
            }
        // If pagination is not required return the educational content list
        } else if( page_number == 0 && page_size == 0 && educationalContentId == null){ 
            return educational_contents;

        // If educationalContentId is provided return the educational content details
        }else {
            const educational_content = educational_contents as EducationalContent;

            return educational_content;            
        }
    }
}
