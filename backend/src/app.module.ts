import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

// Entity imports
import { User } from './user/user.entity';
import { UserAllergy } from './allergies/user_allergy.entity';
import { Country } from './country/country.entity';
import { Cuisine } from './cuisine/cuisine.entity';
import { Dietary } from './dietary/dietary.entitry';
import { FoodCategory } from './food-category/foodCategory.entity';
import { Component } from './library/recipe/component/component.entity';
import { RecipeComponent } from './library/recipe/recipe-component/recipe-component.entity';
import { Recipe } from './library/recipe/recipe.entity';
import { EducationalContent } from './library/educational/educational.entity';
import { Storage } from './storage/storage.entity';

// Module imports
import { CountryModule } from './country/country.module';
import { DietaryModule } from './dietary/dietary.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { RecipeModule } from './library/recipe/recipe.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';

// Seeder import
import seedCountry from './country/country.seeder';
import initialiseFirebase from './storage/firebase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('HF_NUTRITION_HOST'),
        port: configService.get<number>('HF_NUTRITION_PORT'),
        username: configService.get<string>('HF_NUTRITION_USERNAME'),
        password: configService.get<string>('HF_NUTRITION_PASSWORD'),
        database: configService.get<string>('HF_NUTRITION_DATABASE'),
        entities: [
          User,
          Country,
          Dietary,
          UserAllergy,
          FoodCategory,
          Cuisine,
          Recipe,
          EducationalContent,
          Storage,
          RecipeComponent,
          Component,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CountryModule,
    DietaryModule,
    CuisineModule,
    RecipeModule,
    UserModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log("database data source: ", dataSource.driver.database);

    // seed country data
    seedCountry(this.dataSource); 
    initialiseFirebase();
  }
}
