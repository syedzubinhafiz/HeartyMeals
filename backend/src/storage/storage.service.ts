import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageType } from './storage.enum';
import { Repository } from 'typeorm';
import { getStorage, getDownloadURL } from 'firebase-admin/storage'

@Injectable()
export class StorageService {

    constructor(
        @InjectRepository(Storage)
        private storageRepository: Repository<Storage>
    ){}

    pathValidation(userId, recipeId, file){
        return !(userId == null && recipeId == null) && !(file == null || file.size <= 0);
    }

    // match the file extension type to the enum available 
    fileExtensionValidation<T>(enumObj: T, value: string): T[keyof T] | undefined {
        var splitted = value.split("/");
        const enumValues = Object.values(enumObj);
        return enumValues.includes(splitted[1] as any) ? (splitted[1] as T[keyof T]) : undefined;
    }

    uploadFile(userId, recipeId, file : Express.Multer.File){        
        if (process.env.DEBUG === "true")  {
            // data validation
            if (!this.pathValidation(userId, recipeId, file)){
                return "bad path";
            }

            var file_extension = this.fileExtensionValidation(StorageType, file.mimetype);
            if (file_extension == undefined){
                return "bad file extension";
            }

            // get the bucket
            const bucket = getStorage().bucket();

            const file_name = file.originalname;
            // validation check to see what type of upload it is for and to prepare the path
            var path = ``;
            if (userId != null){
                // upload is for user 
                if (recipeId != null){
                    // upload custom recipe photo
                    path = `user/${userId}/${recipeId}/${file_name}`;
                }
                else {
                    // upload user photo
                    path = `user/${userId}/profile_picture/${file_name}`;
                }
            }
            else {
                // upload for official recipe
                path = `official_recipe/${recipeId}/${file_name}`;
            }

            // upload data to firebase
            const file_upload = bucket.file(`${path}`);
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
                    // TODO: update to actual path in the future
                    const image_url = `https://storage.googleapis.com/${bucket.name}/${path}`;
                    resolve(image_url);
                })
                stream.end(file.buffer);
            });

            
            upload_promise
                .then(async (image_url) => {
                    // This code runs if the promise is resolved
                    console.log("Upload successful:", image_url);

                    // TODO: save the path to database?
                    const new_storage = new Storage();

                    new_storage.file_path = path;
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
        }
        else {
            console.log("It works. Source: trust me bro");
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

        
        // get the storage
        const bucket = getStorage().bucket();
        
        // delete in firebase
        const file_download = bucket.file(`${entry.file_path}`)
        file_download.delete();
        // delete in database
        await this.storageRepository.delete(entry);

        // successfully deleted
        return true;
    }

}
