import { Body, Controller, Get, Headers, HttpException, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EntityManager } from 'typeorm';
import { FileUploadDTO } from './dto/file-upload-dto';
import { CommonService } from 'src/common/common.service';

@Controller('storage')
export class StorageController {

    constructor(
        private storageService: StorageService,
        private commonService: CommonService,
        private readonly entityManager: EntityManager,
    ){}

    @Post('upload')
    async upload(@Headers() headers: any, @Body() fileUploadDTO: FileUploadDTO){
        const decoded_headers = this.commonService.decodeHeaders(headers.authorization);
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {

                const storage_links = await this.storageService.uploadFile(decoded_headers, fileUploadDTO, transactionalEntityManager);

                console.log(storage_links)
            });
            return new HttpException("Files uploaded successfully.", 200);
        } catch (e) {
            return new HttpException(e.message, e.status);
        }
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

