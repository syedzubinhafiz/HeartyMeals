import { Controller, Get, Param, Res, StreamableFile, HttpException, HttpStatus } from '@nestjs/common';
import { StorageService } from './storage.service';
import { Response } from 'express';

@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Get(':id')
    async getFile(@Param('id') id: string, @Res() res: Response) {
        try {
            const file = await this.storageService.getFileFromDb(id);

            if (!file || !file.data) {
                throw new HttpException('File not found', HttpStatus.NOT_FOUND);
            }

            res.setHeader('Content-Type', file.type);
            res.setHeader('Content-Length', file.size.toString());
            res.send(file.data);

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error retrieving file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 