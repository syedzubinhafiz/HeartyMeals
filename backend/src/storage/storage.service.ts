import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageType } from './enum/storage.enum';
import { EntityManager, In, Repository } from 'typeorm';
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


    async handleUpload(fileUploadDTO: FileUploadDTO, entry: any, repository: any, transactionalEntityManager: EntityManager){
        try {
            const storage_links = await this.uploadFile(fileUploadDTO, transactionalEntityManager);
            
            const saved = await this.updateStorageLinks(storage_links, entry, repository, transactionalEntityManager);
            return true;
        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    /**
     * Upload the file to firebase storage (or local) and save the entry to database
     * @param decodedHeaders - decoded headers from the request
     * @param fileUploadDTO - DTO that contains the file data
     * @param transactionalEntityManager - transactional entity manager to handle the transaction
     * @returns storage_links, JSON object that contains all the storage ids of each file uploaded to cloud and saved in database
     * 
     * @example
     * {
     *  "thumbnail": "storage_id",
     *  "content": {"storage_id", "storage_id"}
     * }
     */
    async uploadFile(fileUploadDTO: FileUploadDTO, transactionalEntityManager: EntityManager){
        // validate if there are files to upload
        if ((fileUploadDTO.thumbnail == undefined || fileUploadDTO.thumbnail == null) && (fileUploadDTO.content == undefined || fileUploadDTO.content == null)){
            return {};
        }

        // get path for upload
        try {
            const storage_links: any = {};
            storage_links['thumbnail'] = null
            storage_links['content'] = [];

            const promises: Promise<string>[] = [];
            // get bucket
            const bucket = (process.env.SAVE_FIREBASE === "true") ? getStorage().bucket() : null;

            // if got thumbnail to upload
            if (fileUploadDTO.thumbnail) {
                if (process.env.SAVE_FIREBASE === "true") {
                    promises.push(this.uploadToFirebase(fileUploadDTO.thumbnail, fileUploadDTO.path, bucket, transactionalEntityManager));
                } else {
                    var fs = require('fs');
                    const local_path = join(__dirname, '../../uploaded/', fileUploadDTO.path, '/');
                    if (!fs.existsSync(local_path)){ fs.mkdirSync(local_path, { recursive: true }); }
                    promises.push(this.saveToLocal(fileUploadDTO.thumbnail, local_path, transactionalEntityManager));
                }
                storage_links['thumbnail'] = await promises[promises.length - 1];
            }
            // if got content to upload
            if (fileUploadDTO.content) {
                const content_promises = fileUploadDTO.content.map(async file_format_DTO => {
                    if (process.env.SAVE_FIREBASE === "true") {
                        return this.uploadToFirebase(file_format_DTO, fileUploadDTO.path, bucket, transactionalEntityManager);
                    } else {
                        var fs = require('fs');
                        const local_path = join(__dirname, '../../uploaded/', fileUploadDTO.path, '/');
                        if (!fs.existsSync(local_path)){ fs.mkdirSync(local_path, { recursive: true }); }
                        return this.saveToLocal(file_format_DTO, local_path, transactionalEntityManager);
                    }
                });
                promises.push(...content_promises);
                const content_ids = await Promise.all(content_promises);
                content_ids.forEach((id, index) => {
                    storage_links['content'][`${index}`](id);
                });
            }

            // resolve all promises
            await Promise.all(promises);
            return storage_links;
        }
        catch (e){
            throw e;
        }
    }

    /**
     * Delete the file from firebase storage (or local) and delete the entry from database
     * @param storageIds - storage ids to delete the file in an array
     * @param transactionalEntityManager - transactional entity manager to handle the transaction
     * @returns true if file is successfully deleted
     */
    async deleteFile(storageIds: string[], transactionalEntityManager: EntityManager){
        // data validation. if storage id is valid it will run, else it will throw error.
        try {
            var entries = await transactionalEntityManager.find(Storage, {
                where: {
                    storage_id: In(storageIds)
                }
            });

            if (entries.length === 0) {
                throw new HttpException('No entries found for the given storage IDs.', HttpStatus.BAD_REQUEST);
            }
    
            if (entries.length !== storageIds.length) {
                throw new HttpException('Not all storage IDs were found in the database.', HttpStatus.BAD_REQUEST);
            }
    
            // Get the storage bucket if using Firebase
            const bucket = process.env.SAVE_FIREBASE === "true" ? getStorage().bucket() : null;
    
            // Create an array of promises for deletion
            entries.forEach(async (entry) => {
                const query_runner = transactionalEntityManager.connection.createQueryRunner();
                if (!query_runner) {
                    throw new HttpException('Query Runner not available', HttpStatus.INTERNAL_SERVER_ERROR);
                }

                // Establish real database connection using our new query runner
                await query_runner.connect();
            
                await query_runner.startTransaction();
            
                try {
                    if (bucket) {
                        // Delete file from Firebase Storage
                        const file = bucket.file(entry.file_path);
                        await file.delete();
                    } else {
                        // Check if the file exists locally
                        await fs.access(entry.file_path);
                        // Delete the file from the local filesystem
                        await fs.unlink(entry.file_path);
                    }
            
                    // Delete the entry from the database within the transaction
                    await query_runner.manager.delete(Storage, entry.storage_id);
            
                    // Commit the transaction after successful file and database deletion
                    await query_runner.commitTransaction();
                } catch (error) {
                    // Rollback the transaction in case of any errors
                    await query_runner.rollbackTransaction();
            
                    // Handle the error
                    throw new HttpException(`Error during deletion: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
                } finally {
                    // Release the query runner
                    await query_runner.release();
                }
            });
            return true;
        }
        catch (e){
            // Handle any errors related to the transaction setup
            throw new HttpException(`Transaction setup error: ${e.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a public file link from firebase storage by retriving entry from databases
     * @param storageIds - storage ids to get the file in an array
     * @returns a list of download urls of the files
     */
    async getFiles(storageIds: string[]){
        // data validation. if storage id is valid it will run, else it will throw error.
        try {
            var entries = await this.storageRepository.find({
                where: {
                    storage_id: In(storageIds)
                }
            });

            if (entries.length === 0) {
                throw new HttpException('No entries found for the given storage IDs.', HttpStatus.BAD_REQUEST);
            }
    
            if (entries.length !== storageIds.length) {
                throw new HttpException('Not all storage IDs were found in the database.', HttpStatus.BAD_REQUEST);
            }

            if (process.env.SAVE_FIREBASE === "true")  {
                const bucket = getStorage().bucket();

                const download_url_promises = entries.map(async (entry) => {
                    const file = bucket.file(entry.file_path);
                    const [url] = await file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491', // Long expiration date
                    });
                    return url;
                });

                return Promise.all(download_url_promises);
            }
            else {
                return entries.map((entry) => {
                    return entry.file_path;
                });
            }
        }
        catch (e){
            throw e;
        }
    }

    /**
     * Local method to upload file to firebase storage
     * @param file - file data
     * @param upload_path - path to upload the file
     * @param bucket - firebase storage bucket
     * @param transactionalEntityManager - transactional entity manager to handle the transaction
     * @returns promise that resolves to the storage id of the file
     */
    async uploadToFirebase(file: any, upload_path: string, bucket: any, transactionalEntityManager: any): Promise<string> {
        const file_path = `${upload_path}/${file.fileName}`;
        const buffer = Buffer.from(file.fileDataInBase64, 'base64');
        const file_upload = bucket.file(file_path);
    
        const stream = file_upload.createWriteStream({
            metadata: {
                contentType: file.fileType,
            },
        });

        return new Promise<string>((resolve, reject) => {
            stream.on('error', reject);
    
            stream.on('finish', async () => {
                try {
                    const storage_object = await this.saveToDatabase(file_path, file.fileType, buffer.length, transactionalEntityManager);
                    resolve(storage_object.storage_id);
                } catch (e) {
                    reject(e);
                }
            });
    
            stream.end(buffer);
        });
    }

    /**
     * Local method to save file to local storage
     * @param file - file data
     * @param local_path - path to save the file
     * @param transactionalEntityManager - transactional entity manager to handle the transaction
     * @returns promise that resolves to the storage id of the file
     */
    async saveToLocal(file: any, local_path: string, transactionalEntityManager: any): Promise<string> {
        const file_path = `${local_path}/${file.fileName}`;
        const buffer = Buffer.from(file.fileDataInBase64, 'base64');
        const write_stream = createWriteStream(file_path);
    
        return new Promise<string>((resolve, reject) => {
            write_stream.on('error', reject);
    
            write_stream.on('finish', async () => {
                try {
                    const storage_object = await this.saveToDatabase(file_path, file.fileType, buffer.length, transactionalEntityManager);
                    resolve(storage_object.storage_id);
                } catch (e) {
                    reject(e);
                }
            });
    
            write_stream.end(buffer);
        });
    }

    /**
     * Local method to create and save the file entry to database using given information
     * @param file_path - path of the file
     * @param file_type - type of the file
     * @param file_size - size of the file
     * @param transactionalEntityManager - transactional entity manager to handle the transaction
     * @returns 
     */
    async saveToDatabase(file_path: string, file_type: StorageType, file_size: number, transactionalEntityManager: any): Promise<Storage> {
        const new_storage = new Storage();
        new_storage.file_path = file_path;
        new_storage.type = file_type as StorageType;
        new_storage.size = file_size;
    
        return transactionalEntityManager.save(new_storage);
    }

    private async updateStorageLinks(storageLinks: Object, entry: any, repository: any, transactionalEntityManager: EntityManager) {
        try {
            entry.storage_links = storageLinks;
            await transactionalEntityManager.save(repository, entry);
            return true;
        } catch (error) {
            throw new HttpException(`Error during update: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getDefaultImage(){
        if (process.env.SAVE_FIREBASE === "true"){
            const bucket = getStorage().bucket();
            const file = bucket.file('default/default.png');
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491', // Long expiration date
            });
            return url;
        }
        else {
            const default_path = join(__dirname, '../../uploaded/default/default.png');
            return default_path;
        }
    }
    
}
