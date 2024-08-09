import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class EducationalService {
    constructor(
        @InjectRepository(EducationalContent)
        private educatinoalContentRepository: Repository<EducationalContent>,
        private storageService: StorageService
    ){}


    async uploadContent(title, text, files){
        // then save the data to db
        var new_entry = new EducationalContent();
        new_entry.content = text;
        new_entry.storage_links = null;
        new_entry.title = title;
        // create an entry with no links first (to get the edu_id for path)
        const edu_id = await this.educatinoalContentRepository.save(new_entry);

        // files CAN be empty if edu content only upload the text first
        // prepare the path first 
        var path = `${edu_id}`;

        // call the upload method 
        // by passing the data to the method 
        var json_links = {} as JSON;
        await this.storageService.uploadFile(path, files).then(async function(result) {
            if (typeof(result) === "string"){
                return result;
            }
            else {
                for (var key in result){
                    json_links[key] = result[key];
                }
            } 
        });
        edu_id.storage_links = json_links;
        await this.educatinoalContentRepository.save(edu_id);
        return edu_id;
    }

    async deleteContent(eduId){
        // get the entry

        // get the files storage link
        // delete storage link first
        
        // delete the entry
    }
}
