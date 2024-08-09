import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {

    constructor(private storageService: StorageService){}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files[]'))
    upload(@Body('data') payload: string, @UploadedFiles() files: Array<Express.Multer.File>){
        // parse the data from string to json 
        const data = JSON.parse(payload);

        return this.storageService.uploadFile(data["path"], files);
    }

    @Post('delete')
    delete(@Body('data') payload: string){
        // parse the data from string to json 
        const data = JSON.parse(payload);

        return this.storageService.deleteFile(data["storageId"]);;
    }

    @Get('delete')
    get(@Body('data') payload: string){
        // parse the data from string to json 
        const data = JSON.parse(payload);

        return this.storageService.deleteFile(data["storageId"]);;
    }
}
