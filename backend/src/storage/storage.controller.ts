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
            });
            return new HttpException("Files uploaded successfully.", 200);
        } catch (e) {
            return new HttpException(e.message, e.status);
        }
    }

    @Post('delete')
    async delete(@Body("storage_ids") payload){
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {

                this.storageService.deleteFile(payload, transactionalEntityManager);

            });
            return new HttpException("Files deleted successfully.", 200);
        } catch (e) {
            return new HttpException(e.message, e.status);
        }
    }

    @Get('get')
    get_from_id(@Body("storage_ids") payload){
        try {
            return this.storageService.getFiles(payload);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
    }
}

