import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

// Module imports
import { CountryModule } from './country/country.module';
import { DietaryModule } from './dietary/dietary.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

// Seeder import
import seedCountry from './country/country.seeder';
import initialiseFirebase from './storage/firebase.config';
import { EducationalModule } from './educational/educational.module';
import { EthnicityModule } from './ethnicity/ethnicity.module';
import { AllergiesModule } from './allergy/allergy.module';
import { FoodCategoryModule } from './food-category/food-category.module';
import seedEthnicity from './ethnicity/ethnicity.seeder';
import seedFoodCategory from './food-category/food-category.seeder';
import seedDietary from './dietary/dietary.seeder';
import { dataSourceOptions } from './db/data-source';
import { MealLoggingModule } from './meal-logging/meal-logging.module';
import { FluidLoggingModule } from './fluid-logging/fluid-logging.module';
import { MealLogSummaryModule } from './meal-log-summary/meal-log-summary.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    CountryModule,
    DietaryModule,
    CuisineModule,
    RecipeModule,
    UserModule,
    StorageModule,
    EthnicityModule,
    AllergiesModule,
    FoodCategoryModule,
    EducationalModule,
    MealLoggingModule,
    FluidLoggingModule,
    MealLogSummaryModule,
    AnalyticsModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log("database data source: ", dataSource.driver.database);

    // seed country data
    seedCountry(this.dataSource); 
    seedEthnicity(this.dataSource);
    seedFoodCategory(this.dataSource);
    seedDietary(this.dataSource);
    if (process.env.DEBUG === "true"){
      initialiseFirebase();
    }
  }
}
