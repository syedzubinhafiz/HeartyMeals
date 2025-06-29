import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './db/data-source';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ComponentModule } from './component/component.module';
import { RecipeModule } from './recipe/recipe.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { CountryModule } from './country/country.module';
import { StorageModule } from './storage/storage.module';
import { FoodCategoryModule } from './food-category/food-category.module';
import { MealLoggingModule } from './meal-logging/meal-logging.module';
import { MealLogSummaryModule } from './meal-log-summary/meal-log-summary.module';
import { EthnicityModule } from './ethnicity/ethnicity.module';
import { DietaryModule } from './dietary/dietary.module';
import { AllergiesModule } from './allergy/allergy.module';
import { EducationalModule } from './educational/educational.module';
import { FluidLoggingModule } from './fluid-logging/fluid-logging.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import initialiseFirebase from './storage/firebase.config';

// Seeder import
import seedCountry from './country/country.seeder';
import seedEthnicity from './ethnicity/ethnicity.seeder';
import seedFoodCategory from './food-category/food-category.seeder';
import seedDietary from './dietary/dietary.seeder';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploaded'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    ComponentModule,
    RecipeModule,
    AnalyticsModule,
    CuisineModule,
    CountryModule,
    StorageModule,
    FoodCategoryModule,
    MealLoggingModule,
    MealLogSummaryModule,
    EthnicityModule,
    DietaryModule,
    AllergiesModule,
    EducationalModule,
    FluidLoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {
    console.log("database data source: ", dataSource.driver.database);

    // seed country data
    seedCountry(this.dataSource); 
    seedEthnicity(this.dataSource);
    seedFoodCategory(this.dataSource);
    seedDietary(this.dataSource);
  }

  async onModuleInit() {
    console.log('🚀 Starting backend server...');
    if (process.env.SAVE_FIREBASE === "true") {
      try {
        initialiseFirebase();
        console.log('✅ Firebase initialized successfully');
      } catch (error) {
        console.error('❌ Firebase initialization failed:', error.message);
        process.exit(1);
      }
    } else {
      console.log('📁 Using local file storage (Firebase disabled)');
    }
  }
}
