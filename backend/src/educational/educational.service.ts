import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { StorageService } from 'src/storage/storage.service';
import { Visibility } from '../recipe/enum/visibility.enum';
import { AddEducationalContentDTO } from './dto/add-edu-content-dto';

@Injectable()
export class EducationalService {
    constructor(
        @InjectRepository(EducationalContent)
        private educatinoalContentRepository: Repository<EducationalContent>,
        private storageService: StorageService
    ){}


    /**
     * Upload the content to database and firebase by creating a new educational content object
     * @param title - title of article
     * @param content - content of article
     * @param files - files of article
     * @returns newly created educational content object
     */
    async uploadContent(addEducationalContentDTO: AddEducationalContentDTO, transactionalEntityManager: EntityManager){


        // create and save an entry of educational content object to the database first to obtain the uuid of the object.
        var new_entry = new EducationalContent();
        new_entry.title = addEducationalContentDTO.educationalContent.title;
        new_entry.summary = addEducationalContentDTO.educationalContent.summary;
        new_entry.content = addEducationalContentDTO.educationalContent.content;
        new_entry.storage_links = {} as JSON;
        
        // create an entry with no links first (to get the edu_id for path)
        try {
            return await transactionalEntityManager.save(new_entry);
        }
        catch (e){
            throw new HttpException('Failed to upload educational content', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get Educational Content
     * @param eduId - educational id
     * @returns educational content object
     */
    async getContent(eduId){
        // get file from repository
        try {
            return await this.educatinoalContentRepository.findOneBy({id: eduId});
        }
        catch (e){
            return e;
        }
    }

    /**
     * Take current educational content id and edit the content 
     * @param eduId - educational content id 
     * @param title - new title
     * @param content - new content
     * @param files - new files
     * @returns newly updated educational content object
     */
    async editContent(eduId, title, content, files){
        // data validation 
        if (title == null || content == null || files.length <= 0){
            return "Either title, content, or files is empty";
        }

        // get edu_content object
        var entry = await this.getContent(eduId);

        var saved_content = []
        // for each element in the array passed in, create a json object with "type" and " content"
        // check if it is text or files
        // if text, save the type as "text", content as the actual text, and put into the saved_content array 
        // if files, save the type as "files", content as the index of the files in the files array
        var file_counter = 0;
        content.forEach(item => {
            if (item.type === "text"){
                saved_content.push({
                    "type": "text",
                    "content": item.info
                });
            }
            else { 
                saved_content.push({
                    "type": "files",
                    "content": file_counter
                });
                file_counter += 1;
            }
        });

        // upload file
        // get json link
        // prepare the path first 
        var path = `${entry.id}`;

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


        entry.title = title;
        entry.content = saved_content;
        entry.storage_links = json_links;

        // update entry
        // update updatedAt() column
        entry.updatedAt = new Date();
        // return new entry
        return await this.educatinoalContentRepository.save(entry);
    }
}
