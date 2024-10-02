import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';
import { StorageService } from 'src/storage/storage.service';
import { Visibility } from '../recipe/enum/visibility.enum';

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

        edu_object.storage_links = {} as JSON;
        return await this.educatinoalContentRepository.update(edu_object.id, edu_object);
    }

    /**
     * Get Educational Content based on the search criteria, or get the educational content based on the educational content id
     * @param page - page number
     * @param pageSize - page size
     * @param search - search query
     * @param pagination - pagination flag
     * @param educationalContentId - educational content id (Optional)
     * @returns educational content object
     */
    async getEducationalContent(
        page: number, 
        pageSize:number,
        search: string|null,
        pagination: boolean = true,
        educationalContentId: string = null
    ): Promise<[EducationalContent[]|EducationalContent, number]>{
        // Calculate the number of items to skip
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        if (educationalContentId == null){
        // get file from repository
        
            const query = this.educatinoalContentRepository.createQueryBuilder("educational_content")
            .select([
                'educational_content.id', 
                'educational_content.title', 
                'educational_content.summary',
                'educational_content.storage_links',
                'educational_content.visibility'                
            ])
            .where("educational_content.visibility = :visibility", { visibility: Visibility.PUBLIC })
                

            // Search for educational content through summary or title
            if (search != null){
                query.andWhere("educational_content.title ILIKE :search OR educational_content.summary ILIKE :search", { search: `%${search}%` })
            }

            // Pagination
            if (pagination){
                query.skip(skip)
                .take(take)
            };
            
            const [result, no_of_results] = await query.getManyAndCount();

            for (const edu_content of result){
                // set the thumbnail link
                edu_content.storage_links['thumbnail'] = await this.storageService.getLink(edu_content.storage_links['thumbnail']);
            }

            return [result, no_of_results]
        
        }
        else {
            const edu_content = await this.educatinoalContentRepository.findOneBy({
                id: educationalContentId
            });

            // set the thumbnail link
            edu_content.storage_links['thumbnail'] = await this.storageService.getLink(edu_content.storage_links['thumbnail']);
            
            // post process to get all the links into the content array
            // get all the links first, loop all keys in the storage_ids to form an array
            var links = {};

            // get the actual links from the storage service 
            if (edu_content.storage_links['content'] != null){
                for (const keys in edu_content.storage_links['content']){
                    links[keys] = await this.storageService.getLink(edu_content.storage_links['content'][keys]);
                }
            }
            
            // update the content with the links
            const updated_content = this.replaceSrcInArray(edu_content.content, links);

            edu_content.content = updated_content;

            return [edu_content, 1];
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

        entry.title = title;
        entry.content = saved_content;
        entry.storage_links = json_links;

        // update entry
        // update updatedAt() column
        entry.updatedAt = new Date();
        // return new entry
        return await this.educatinoalContentRepository.save(entry);
    }

    replaceSrcInArray(strings, replacements) {
        return strings.map(str => {
          Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`src="${key}"`, 'g');
            str = str.replace(regex, `src="${replacements[key]}"`);
          });
          return str;
        });
    }      
}
