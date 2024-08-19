import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {

    constructor(private storageService: StorageService){}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files[]'))
    upload(@Body('data') payload, @UploadedFiles() files: Array<Express.Multer.File>){
        return this.storageService.uploadFile(JSON.parse(payload).path, files);
    }

    @Post('delete')
    delete(@Body() payload){
        return this.storageService.deleteFile(payload.storageId);
    }

    @Get('get_from_path')
    get_from_path(@Body() payload){
        return this.storageService.getFileFromPath(payload.path);
    }

    @Get('get_from_id')
    get_from_id(@Body() payload){
        return this.storageService.getFileFromId(payload.id);
    }
}

