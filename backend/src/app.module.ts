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
import { RecipeModule } from './library/recipe/recipe.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

// Seeder import
import seedCountry from './country/country.seeder';
import initialiseFirebase from './storage/firebase.config';
import { EducationalModule } from './library/educational/educational.module';
import { Type } from 'class-transformer';
import { getTypeOrmConfig } from './db/config';
import { EthnicityModule } from './ethnicity/ethnicity.module';
import { AllergiesModule } from './allergies/allergies.module';
import { FoodCategoryModule } from './food-category/food-category.module';
import seedEthnicity from './ethnicity/ethnicity.seeder';
import seedFoodCategory from './food-category/food-category.seeder';
import seedDietary from './dietary/dietary.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
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
    // initialiseFirebase();
  }
}
