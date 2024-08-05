import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EducationalContent } from './educational.entity';

@Injectable()
export class EducationService {
    constructor(
        @InjectRepository(EducationalContent)
        private storageRepository: Repository<EducationalContent>
    ){}
}
