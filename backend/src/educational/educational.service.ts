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
        new_entry.visibility = addEducationalContentDTO.educationalContent.visibility;
        new_entry.content = addEducationalContentDTO.educationalContent.content;
        
        // create an entry with no links first (to get the edu_id for path)
        try {
            return await transactionalEntityManager.save(new_entry);
        }
        catch (e){
            throw new HttpException('Failed to upload educational content', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
                'educational_content.visibility',
                'educational_content.created_at',             
            ])
            .where("educational_content.visibility = :visibility", { visibility: Visibility.PUBLIC })
                

            // Search for educational content through summary or title
            if (search != null){
                query.andWhere("educational_content.title ILIKE :search ", { search: `%${search}%` })
            }

            // Pagination
            if (pagination){
                query.skip(skip)
                .take(take)
            };
            
            const [result, no_of_results] = await query.orderBy("educational_content.created_at", "DESC").getManyAndCount();

            for (const edu_content of result){
                // set the thumbnail link - only if it's not already a direct URL
                if (edu_content.storage_links['thumbnail'] && !edu_content.storage_links['thumbnail'].startsWith('http')) {
                    edu_content.storage_links['thumbnail'] = await this.storageService.getLink(edu_content.storage_links['thumbnail']);
                }
            }

            return [result, no_of_results]
        
        }
        else {
            const edu_content = await this.educatinoalContentRepository.findOneBy({
                id: educationalContentId
            });

            // set the thumbnail link - only if it's not already a direct URL
            if (edu_content.storage_links['thumbnail'] && !edu_content.storage_links['thumbnail'].startsWith('http')) {
                edu_content.storage_links['thumbnail'] = await this.storageService.getLink(edu_content.storage_links['thumbnail']);
            }
            
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
     * Get 4 for the main landing page educational content 
     * @returns a list of 4 educational content objects
     */
    async getMainLandingPageContent(){
        const query = this.educatinoalContentRepository.createQueryBuilder("educational_content")
            .select([
                'educational_content.id', 
                'educational_content.title', 
                'educational_content.summary',
                'educational_content.storage_links',
                'educational_content.visibility'                
            ])
            .where("educational_content.visibility = :visibility", { visibility: Visibility.PUBLIC })
            .orderBy("RANDOM()")
            .limit(4);

        const result = await query.getMany();

        for (const edu_content of result){
            // set the thumbnail link - only if it's not already a direct URL
            if (edu_content.storage_links['thumbnail'] && !edu_content.storage_links['thumbnail'].startsWith('http')) {
                edu_content.storage_links['thumbnail'] = await this.storageService.getLink(edu_content.storage_links['thumbnail']);
            }
        }

        return result;
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

    getPath(eduId){
        return `educational_content/${eduId}`;
    }
}
