import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { Repository } from 'typeorm';
import { getStorage, getDownloadURL } from 'firebase-admin/storage'
// import { AddCountryDTO } from './dto/add-country-dto';

@Injectable()
export class StorageService {

    constructor(
        @InjectRepository(Storage)
        private storageRepository: Repository<Storage>
    ){}

    uploadFile(file : Express.Multer.File){      
        if (Boolean(process.env.DEBUG) == true)  {
            // get the bucket
            const bucket = getStorage().bucket();

            const file_name = file.originalname;
            // update path to the actual path 
            const file_upload = bucket.file(`user_id/user_000/${file_name}`);
            const stream = file_upload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                }
            });

            return new Promise((resolve, reject) => {
                stream.on('error', (error) => {
                    reject(error);
                });

                stream.on('finish', () => {
                    const image_url = `https://storage.googleapis.com/${bucket.name}/user_id/user_000/${file_name}`;
                    resolve(image_url);
                })

                stream.end(file.buffer);
            });
        }
        else {
            console.log("It works. Source: trust me bro");
        }
    }

    deleteFile(){
        // get the storage
        const bucket = getStorage().bucket();

        // const file_name = file.originalname;
        // update path to the actual path 
        const file_download = bucket.file(`user_id/user_000/firebase.png`)
        file_download.download();
    }

}
