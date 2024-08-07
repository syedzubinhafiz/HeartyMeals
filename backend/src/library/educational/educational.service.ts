import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class EducationalService {
    constructor(
        @InjectRepository(EducationalContent)
        private educatinoalContentRepository: Repository<EducationalContent>
    ){}


    async uploadContent(userId, eduId, data, files){
        // do validation here
        // user id validation (admin only can upload)
        // files CAN be empty if edu content only upload the text first

        // call the upload method 
        // by passing the data to the method 
    }
}
