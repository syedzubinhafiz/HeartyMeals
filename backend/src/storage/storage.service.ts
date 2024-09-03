import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageType } from './enum/storage.enum';
import { EntityManager, Repository } from 'typeorm';
import { getStorage, getDownloadURL } from 'firebase-admin/storage'
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';
import { FileUploadDTO } from './dto/file-upload-dto';

@Injectable()
export class StorageService {

    constructor(
        @InjectRepository(Storage)
        private storageRepository: Repository<Storage>
    ){}

    /**
     * Method to upload files to the given path
     * @param path - path to upload file to the firebase storage
     * @param files - array of files
     * @returns storage_links, JSON object that contains all the storage ids of each file uploaded to cloud and saved in database
     * 
     * @example
     * {
     *  "thumbnail": "storage_id",
     *  "content": ["storage_id", "storage_id"]
     * }
     */
    async uploadFile(decodedHeaders: any, fileUploadDTO: FileUploadDTO, transactionalEntityManager: EntityManager){
        var storage_links = {};

        // validate if there are files to upload
        if ((fileUploadDTO.thumbnail == undefined || fileUploadDTO.thumbnail == null) && (fileUploadDTO.content == undefined || fileUploadDTO.content == null)){
            return storage_links;
        }

        // get path for upload
        try {
            var upload_path = null;
            if (fileUploadDTO.userId == true){
                upload_path = this.pathPreparation(decodedHeaders['sub'], fileUploadDTO.recipeId, fileUploadDTO.eduContentId);
            }
            else {
                upload_path = this.pathPreparation(null, fileUploadDTO.recipeId, fileUploadDTO.eduContentId);
            }
        }
        catch (e){
            throw e;
        }

        if (process.env.SAVE_FIREBASE === "true")  {
            // get the bucket
            const bucket = getStorage().bucket();
            // resolve all promises at once
            const bucket_upload_promises: Promise<String>[] = [];

            if (fileUploadDTO.thumbnail != undefined && fileUploadDTO.thumbnail != null){
                const thumbnail_promise = new Promise<String>((resolve, reject) => {
                    
                    const thumbnail = fileUploadDTO.thumbnail;

                    const thumbnail_path = `${upload_path}/${thumbnail.fileName}`;

                    const buffer = new Buffer(fileUploadDTO.thumbnail.fileDataInBase64, 'base64');

                    const file_upload = bucket.file(`${thumbnail_path}`);

                    const stream = file_upload.createWriteStream({
                        metadata: {
                            contentType: thumbnail.fileType,
                        }
                    });

                    stream.on('error', (error) => {
                        reject(error);
                    });

                    stream.on('finish', async () => {
                        // once the stream finishes, save to database
                        const new_storage = new Storage();

                        new_storage.file_path = thumbnail_path;
                        new_storage.type = thumbnail.fileType as StorageType;
                        new_storage.size = thumbnail.fileSize;

                        try {
                            const storage_object = await transactionalEntityManager.save(new_storage);
                            storage_links[`thumbnail`] = storage_object.storage_id;
                            resolve(storage_object.storage_id);
                        }
                        catch (e) {
                            reject(e);
                        }

                    })

                    stream.end(buffer);
                });
                bucket_upload_promises.push(thumbnail_promise);
            }
            if (fileUploadDTO.content != undefined && fileUploadDTO.content != null){
                storage_links["content"] = {};
                const content_promises = fileUploadDTO.content.map((file_format_DTO, index) => {

                return new Promise<String>(async (resolve, reject) => {

                    const content_path = `${upload_path}/${file_format_DTO.fileName}`;

                    const file_upload = bucket.file(`${content_path}`);

                    const buffer = new Buffer(file_format_DTO.fileDataInBase64, 'base64');

                    const stream = file_upload.createWriteStream({
                        metadata: {
                            contentType: file_format_DTO.fileType,
                        }
                    });
    
                        stream.on('error', (error) => {
                            reject(error);
                        });
    
                        stream.on('finish', async () => {
                            // once the stream finishes, save to database
                            const new_storage = new Storage();
    
                            new_storage.file_path = content_path;
                            new_storage.type = file_format_DTO.fileType as StorageType;
                            new_storage.size = file_format_DTO.fileSize;
    
                            try {
                                const storage_object = await transactionalEntityManager.save(new_storage);
                                storage_links[`content`][`${index}`] = storage_object.storage_id;
                                resolve(storage_object.storage_id);
                            }
                            catch (e) {
                                reject(e);
                            }
                        })
    
                        stream.end(buffer);
                    })
                });

                bucket_upload_promises.push(...content_promises);
            }

            // resolve all promises at once
            await Promise.all(bucket_upload_promises);
            return storage_links;
        }
        else {
            // save to local directory
            // create a new folder called "uploaded" inside storage
            var fs = require('fs');
            var dir = join(__dirname, '../../src/storage/uploaded/', upload_path,'/');
            
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }

            const local_upload_promises: Promise<String>[] = [];

            if (fileUploadDTO.thumbnail != undefined && fileUploadDTO.thumbnail != null){
                const thumbnail = fileUploadDTO.thumbnail;

                const thumbnail_local_path = `${dir}/${thumbnail.fileName}`;

                // Create a write stream
                const write_stream = createWriteStream(thumbnail_local_path);

                const buffer = new Buffer(fileUploadDTO.thumbnail.fileDataInBase64, 'base64');

                const thumbnail_promise =  new Promise<String> ((resolve, reject) => {
                
                    write_stream.write(buffer);
        
                    write_stream.on('finish', async () => {
                        const new_storage = new Storage();
                        new_storage.file_path = thumbnail_local_path;
                        new_storage.type = thumbnail.fileType as StorageType;
                        new_storage.size = thumbnail.fileSize;
        
                        try {
                            const storage_object = await transactionalEntityManager.save(new_storage);
                            storage_links[`thumbnail`] = storage_object.storage_id;
                            resolve(storage_object.storage_id);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
        
                    write_stream.on('error', (err) => {
                        console.error('Error saving file:', err);
                        reject(err);
                    });

                    write_stream.end();
                });
                local_upload_promises.push(thumbnail_promise);
            }
            if (fileUploadDTO.content != undefined && fileUploadDTO.content != null){
                storage_links["content"] = {};
                const content_promises = fileUploadDTO.content.map((file_format_DTO, index) => {
                    const content_path = `${dir}/${file_format_DTO.fileName}`;

                    // Create a write stream
                    const write_stream = createWriteStream(content_path);

                    const buffer = new Buffer(file_format_DTO.fileDataInBase64, 'base64');

                    return new Promise<String>(async (resolve, reject) => {
                        write_stream.write(buffer);
        
                        write_stream.on('finish', async () => {
                            const new_storage = new Storage();
                            new_storage.file_path = content_path;
                            new_storage.type = file_format_DTO.fileType as StorageType;
                            new_storage.size = file_format_DTO.fileSize;
            
                            try {
                                const storage_object = await transactionalEntityManager.save(new_storage);
                                storage_links[`content`][`${index}`] = storage_object.storage_id;
                                resolve(storage_object.storage_id);
                            }
                            catch (e) {
                                reject(e);
                            }
                        });
            
                        write_stream.on('error', (err) => {
                            console.error('Error saving file:', err);
                            reject(err);
                        });
    
                        write_stream.end();
                    });
                });
                local_upload_promises.push(...content_promises);
            }

            // resolve all promises at once
            await Promise.all(local_upload_promises);
            return storage_links;
        }
    }

    /**
     * Delete file method to delete the file from firebase storage and delete the entry from database
     * @param storageId - storage id to the file
     * @returns true if file is successfully deleted
     */
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
        
              } catch (e) {
                return e;
              }
        }
        // delete in database
        await this.storageRepository.delete(entry);
        return true;
    }

    /**
     * Get a public file link from firebase storage
     * @param path - path to the file in firebase storage
     * @returns a public file link from firebase storage
     */
    async getFileFromPath(path){
        // get file from firebase
        try {
            return await getDownloadURL(getStorage().bucket().file(path));
        }
        catch (e){
            return e;
        }
    }

    /**
     * Get a public file link from firebase storage by retriving entry from databases
     * @param storageId - storage id to get the path
     * @returns a public file link from firebase storage
     */
    async getFileFromId(storageId){
        // data validation. if storage id is valid it will run, else it will throw error.
        try {
            var entry = await this.storageRepository.findOneBy({storage_id: storageId});
            if (process.env.DEBUG === "true")  {
                // get file from firebase
                return await getDownloadURL(getStorage().bucket().file(entry.file_path));
            }
            else {
                return `File is at path ${entry.file_path}`;
            }
        }
        catch (e){
            return e;
        }
    }

    pathPreparation(userId: string = null, recipeId: string = null, eduContentId: string = null){
        if (userId == null && recipeId == null && eduContentId == null){
            throw new HttpException('No path is specified', HttpStatus.BAD_REQUEST);
        }

        if (userId != null && eduContentId != null){
            throw new HttpException('Both userId and eduContentId are specified', HttpStatus.BAD_REQUEST);
        }

        if (recipeId != null && eduContentId != null){
            throw new HttpException('Both recipeId and eduContentId are specified', HttpStatus.BAD_REQUEST);
        }

        var path = "";

        if (userId != null && recipeId != null){
            // custom recipe
            path = `users/${userId}/custom_recipes/${recipeId}`;
        }
        else if (userId != null){
            // user profile picture
            path = `users/${userId}`;
        }
        else if (recipeId != null){
            // official recipe
            path = `recipes/${recipeId}`;
        }
        else if (eduContentId != null){
            // educational content
            path = `eduContent/${eduContentId}`;
        }

        return path;
    }
}
