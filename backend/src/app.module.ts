import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipeController } from './library/recipe/recipe.controller';
import { RecipeService } from './library/recipe/recipe.service';
import { EducationController } from './library/educational/educational.controller';
import { EducationService } from './library/educational/educational.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import {ConfigModule, ConfigService} from '@nestjs/config'
import { DataSource } from 'typeorm';
import { CountryController } from './country/country.controller';
import { CountryService } from './country/country.service';
import { CountryModule } from './country/country.module';




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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {  
  constructor(private dataSource: DataSource){
    console.log("database data source: ", dataSource.driver.database);
  }
}
