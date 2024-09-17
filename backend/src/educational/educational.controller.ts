import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EducationalService } from './educational.service';
import { AddEducationalContentDTO } from './dto/add-edu-content-dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageService } from 'src/storage/storage.service';
import { EducationalContent } from './educational.entity';

@Controller('education')
export class EducationController {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private educationalContentService: EducationalService,
        private readonly entityManager: EntityManager,
        private storageService: StorageService,
    ){}

    @Post('add')
    async upload(@Body() payload: AddEducationalContentDTO){
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const entry =  await this.educationalContentService.uploadContent(payload, transactionalEntityManager);

                if (payload.files){
                    const path = this.educationalContentService.getPath(entry.id);
                    payload.files.path = path;
                    
                    await this.storageService.handleUpload(payload.files, entry, EducationalContent, transactionalEntityManager);
                }
            });
            return new HttpException('Educational content uploaded successfully', HttpStatus.OK);
        }
        catch (e){
            throw new HttpException('Failed to upload educational content', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
