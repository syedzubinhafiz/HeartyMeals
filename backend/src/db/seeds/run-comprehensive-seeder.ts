// Load environment variables first
import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { ComprehensiveMockDataSeeder } from './comprehensive-mock-data.seeder';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { StorageService } from '../../storage/storage.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const storageService = app.get(StorageService);

  const seeder = new ComprehensiveMockDataSeeder(dataSource, storageService);
  await seeder.seed();

  await app.close();
  console.log('Seeding complete!');
}

run(); 