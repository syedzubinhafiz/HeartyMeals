// Load environment variables first
import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../data-source';
import { ComprehensiveMockDataSeeder } from './comprehensive-mock-data.seeder';

async function runSeeder() {
  console.log('🚀 Initializing comprehensive mock data seeder...');
  
  const dataSource = new DataSource(dataSourceOptions);
  
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');
    
    const seeder = new ComprehensiveMockDataSeeder(dataSource);
    await seeder.seed();
    
    console.log('🎉 All mock data has been created successfully!');
    console.log('\n📊 Demo Account Summary:');
    console.log('Admin: admin@heartymeals.com / Admin123!');
    console.log('Dietitian: dietitian@heartymeals.com / Dietitian123!');
    console.log('Patients: patient1@demo.com to patient5@demo.com / Patient123!');
    
  } catch (error) {
    console.error('❌ Error running seeder:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

runSeeder(); 