import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { StorageService } from 'src/storage/storage.service';
import { Visibility } from '../recipe/visibility.enum';

@Injectable()
export class EducationalService {
    constructor(
        @InjectRepository(EducationalContent)
        private educatinoalContentRepository: Repository<EducationalContent>,
        private storageService: StorageService
    ){}


    async uploadContent(title, content, files: Array<Express.Multer.File>){
        // data validation 
        if (title == null || content == null || files.length <= 0){
            return "Either title, content, or files is empty";
        }

        // content that passed in should be like this 
        // [ <block of text>, <block of image/video>, <block of text>]
        // create a saved_content array []
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

        // create and save an entry of educational content object to the database first to obtain the uuid of the object.
        var new_entry = new EducationalContent();
        new_entry.content = saved_content;
        new_entry.storage_links = null;
        new_entry.title = title;
        // create an entry with no links first (to get the edu_id for path)
        const edu_object = await this.educatinoalContentRepository.save(new_entry);

        // upload the files by calling the storage service. the return json should be the same order as the order in the saved_content array
        // update the educational object with storage links and saved_content array

        // files CAN be empty if edu content only upload the text first
        // prepare the path first 
        var path = `${edu_object.id}`;

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
        edu_object.storage_links = json_links;
        return await this.educatinoalContentRepository.update(edu_object.id, edu_object);
    }

    async deleteContent(eduId){
        // get the entry
        try {
            var entry = await this.educatinoalContentRepository.findOneBy({id: eduId});

            // // get the files storage link
            // // delete storage link first
            // var storage_links = entry.storage_links;
            // for (const key in storage_links){
            //     const link = storage_links[key];
            //     await this.storageService.deleteFile(link);
            // }
            
            // // delete the entry
            // return await this.educatinoalContentRepository.delete(entry.id);

            // soft delete
            entry.deletedAt = new Date();
            entry.visibility = Visibility.PRIVATE;
            this.educatinoalContentRepository.save(entry);
            }
        catch (e){
            return e;
        }
    }

    // getContent
    async getContent(eduId){
        // get file from repository
        try {
            return await this.educatinoalContentRepository.findOneBy({id: eduId});
        }
        catch (e){
            return e;
        }
    }

    // editContent
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
        this.educatinoalContentRepository.save(entry);
        // return new entry
        return entry;
    }
}
