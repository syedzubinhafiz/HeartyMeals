import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {

    constructor(private storageService: StorageService){}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(@Body('data') payload: string, @UploadedFile() file: Express.Multer.File){
        // parse the data from string to json 
        const data = JSON.parse(payload);

        return this.storageService.uploadFile(data["userId"], data["recipeId"], data["eduId"], file);
    }

    @Post('delete')
    delete(@Body('data') payload: string){
        // parse the data from string to json 
        const data = JSON.parse(payload);

        return this.storageService.deleteFile(data["storageId"]);;
    }
}
