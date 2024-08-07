import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageType } from './storage.enum';
import { Repository } from 'typeorm';
import { getStorage } from 'firebase-admin/storage'
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class StorageService {

    constructor(
        @InjectRepository(Storage)
        private storageRepository: Repository<Storage>,
        private commonService: CommonService
    ){}

    /**
     * Method to get the correct file extension
     * @param enumObj StorageType
     * @param value 
     * @returns available file extension, or undefined
     */
    fileExtensionValidation<T>(value: string){
        var splitted = value.split("/");
        const enumValues = Object.values(StorageType);
        return enumValues.includes(splitted[1] as any) ? (splitted[1] as T[keyof T]): undefined
    }

    /**
     * Method to prepare path for file upload
     * @param userId - user id
     * @param recipeId - recipe id
     * @param eduId - educational content id
     * @returns a path that the file will upload to
     */
    pathPreparation(userId, recipeId, eduId){
        var path = ``;
        if (userId != null){
            // upload is for user 
            if (recipeId != null){
                // upload custom recipe photo
                path = `user/${userId}/${recipeId}`;
            }
            else {
                // upload user photo
                path = `user/${userId}/profile_picture`;
            }
        }
        else {
            if (recipeId != null){
                // upload for official recipe
                path = `official_recipe/${recipeId}`;
            }
            else {
                // upload is for educational content
                path = `educational_content/${eduId}`;
            }

        }
        return path;
    }

    async uploadFile(userId, recipeId, eduId, files: Array<Express.Multer.File>){     
        // data validation
        if (!this.commonService.pathValidation(userId, recipeId, eduId)){
            return "bad path";
        }

        // validation check to see what type of upload it is for and to prepare the path
        var path = this.pathPreparation(userId, recipeId, eduId);


        if (process.env.DEBUG === "true")  {
            // get the bucket
            const bucket = getStorage().bucket();
            files.forEach(file => {
                // get file name
                const file_name = file.originalname;
                
                // get file extension
                var file_extension = this.fileExtensionValidation(file.mimetype);
                if (file_extension == undefined){
                    return "bad file extension";
                }   

                // path to bucket
                const bucket_path = `${path}/${file_name}`;
                // upload data to firebase
                const file_upload = bucket.file(`${bucket_path}`);
                const stream = file_upload.createWriteStream({
                    metadata: {
                        contentType: file.mimetype,
                    }
                });

                // create a promise to handle the upload
                const upload_promise = new Promise((resolve, reject) => {
                    stream.on('error', (error) => {
                        reject(error);
                    });
                    stream.on('finish', () => {
                        const image_url = `https://storage.googleapis.com/${bucket.name}/${path}`;
                        resolve(image_url);
                    })
                    stream.end(file.buffer);
                });

                
                upload_promise
                    .then(async (image_url) => {
                        // This code runs if the promise is resolved
                        console.log("Upload successful:", image_url);

                        // save to database
                        const new_storage = new Storage();

                        new_storage.file_path = bucket_path;
                        new_storage.type = file_extension;
                        new_storage.size = file.size;

                        await this.storageRepository.save(new_storage);
                    })
                    .catch((error) => {
                        // This code runs if the promise is rejected
                        console.error("Upload failed:", error);
                    });

                // return promise
                return upload_promise;
            });
        }
        else {
            // save to local directory
            // create a new folder called "uploaded" inside storage
            var fs = require('fs');
            var dir = join(__dirname, '../../src/storage/uploaded/', path,'/');
            
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }

            files.forEach(file => {
                // get file extension
                var file_extension = this.fileExtensionValidation(file.mimetype);
                if (file_extension == undefined){
                    return "bad file extension";
                }
                
                const uploaded_path = join(dir, file.originalname);
                // Create a write stream
                const writeStream = createWriteStream(uploaded_path);

                // Write the file stream to the new location
                writeStream.write(file.buffer);

                // Close the stream
                writeStream.end();

                // Handle stream events
                writeStream.on('finish', async () => {
                    console.log('File saved successfully.');
                    const new_storage = new Storage();

                    new_storage.file_path = uploaded_path;
                    new_storage.type = file_extension;
                    new_storage.size = file.size;

                    await this.storageRepository.save(new_storage);
                });

                writeStream.on('error', (err) => {
                    console.error('Error saving file:', err);
                });                
            });
            return { message: 'All files uploaded and saved successfully.' };
        }
    }

    async deleteFile(storageId){
        // data validation. if storage id is valid it will run, else it will throw error.
        try {
            var entry = await this.storageRepository.findOneBy({storage_id: storageId});
        }
        catch (e){
            return e;
        }

        if (process.env.DEBUG === "true")  {
            // get the storage
            const bucket = getStorage().bucket();
            
            // delete in firebase
            const file_download = bucket.file(`${entry.file_path}`)
            file_download.delete();
        }
        else {
            try {
                // Check if the file exists
                await fs.access(entry.file_path);
                
                // Delete the file
                await fs.unlink(entry.file_path);
        
              } catch (error) {
                return { message: 'File not found'}
              }
        }
        // delete in database
        await this.storageRepository.delete(entry);
        return true;
    }

}
