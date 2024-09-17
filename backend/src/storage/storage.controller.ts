import { Body, Controller, Get, Headers, HttpException, Post, Query} from '@nestjs/common';
import { StorageService } from './storage.service';
import { EntityManager } from 'typeorm';
import { FileUploadDTO } from './dto/file-upload-dto';

@Controller('storage')
export class StorageController {

    constructor(
        private storageService: StorageService,
        private readonly entityManager: EntityManager,
    ){}

    @Post('upload')
    async upload(@Body() fileUploadDTO: FileUploadDTO){
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {

                const storage_links = await this.storageService.uploadFile(fileUploadDTO, transactionalEntityManager);
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
    async get(@Query("id") payload){
        try {
            return this.storageService.getFiles(payload);
        }
        catch (e){
            return new HttpException(e.message, e.status);
        }
    }
}

