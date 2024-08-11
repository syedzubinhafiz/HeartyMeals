import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageType } from './storage.enum';
import { Repository } from 'typeorm';
import { getStorage, getDownloadURL } from 'firebase-admin/storage'
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

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
     */
    async uploadFile(path, files: Array<Express.Multer.File>){
        var storage_links = {};
        if (process.env.DEBUG === "true")  {
            // get the bucket
            const bucket = getStorage().bucket();
            
            const upload_promises = files.map((file, index) => {

                return new Promise<String>(async (resolve, reject) => {
                    // get file name
                    const file_name = file.originalname;
                    
                    // get file extension
                    var file_extension = this.fileExtensionValidation(file.mimetype);
                    if (file_extension == undefined){
                        return "File extension not supported";
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

                    stream.on('error', (error) => {
                        reject(error);
                    });
                    stream.on('finish', async () => {
                        // save to database
                        const new_storage = new Storage();

                        new_storage.file_path = bucket_path;
                        new_storage.type = file_extension;
                        new_storage.size = file.size;

                        try {
                            const storage_object = await this.storageRepository.save(new_storage);
                            storage_links[`file${index}`] = storage_object.storage_id;
                            resolve(storage_object.storage_id);
                        }
                        catch (e) {
                            reject(e);
                        }
                    })
                    stream.end(file.buffer);
                })
            });
            await Promise.all(upload_promises);
            return storage_links;
        }
        else {
            // save to local directory
            // create a new folder called "uploaded" inside storage
            var fs = require('fs');
            var dir = join(__dirname, '../../src/storage/uploaded/', path,'/');
            
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }

            files.forEach((file, index) => {
                // get file extension
                var file_extension = this.fileExtensionValidation(file.mimetype);
                if (file_extension == undefined){
                    return "File extension not supported";
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
                    const new_storage = new Storage();

                    new_storage.file_path = uploaded_path;
                    new_storage.type = file_extension;
                    new_storage.size = file.size;

                    var storage_id = await this.storageRepository.save(new_storage);
                    storage_links[`${index}`] = storage_id;
                });

                writeStream.on('error', (err) => {
                    console.error('Error saving file:', err);
                });                
            });
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
}
