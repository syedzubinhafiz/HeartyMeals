import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {

    constructor(private storageService: StorageService){}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files[]'))
    upload(@Body() payload, @UploadedFiles() files: Array<Express.Multer.File>){
        return this.storageService.uploadFile(payload.path, files);
    }

    @Post('delete')
    delete(@Body() payload){
        return this.storageService.deleteFile(payload.storageId);
    }

    @Get('get')
    get(@Body() payload){
        return this.storageService.getFile(payload.path);
    }
}
