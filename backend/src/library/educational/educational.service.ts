import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { CommonService } from 'src/common/common.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class EducationalService {
    constructor(
        @InjectRepository(EducationalContent)
        private educatinoalContentRepository: Repository<EducationalContent>,
        private commonService: CommonService,
        private storageService: StorageService
    ){}


    async uploadContent(userId, eduId, title, text, files){
        if (process.env.DEBUG === "true"){
            // do validation here
            // user id validation (admin only can upload)
            if (!this.commonService.isAdmin(userId)){
                return "Not admin";
            }
            // path validation
            // null because no need admin id as path
            if (!this.commonService.pathValidation(null, null, eduId)){
                return "Bad path";
            }
            // files CAN be empty if edu content only upload the text first

            // call the upload method 
            // by passing the data to the method 
            var json_links = {} as JSON;
            await this.storageService.uploadFile(null, null, eduId, files).then(async function(result) {
                if (typeof(result) === "string"){
                    return result;
                }
                else {
                    for (var key in result){
                        json_links[key] = result[key];
                    }
                } 
            });
            // then save the data to db
            const new_entry = new EducationalContent();
            new_entry.content = text;
            new_entry.storage_links = json_links;
            new_entry.title = title;
            return await this.educatinoalContentRepository.save(new_entry);
        }
        else {
            // just save to db
        }
    }

    async deleteContent(eduId){
        // get the entry

        // get the files storage link
        // delete storage link first
        
        // delete the entry
    }
}
