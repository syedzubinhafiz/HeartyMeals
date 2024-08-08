import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import { Country } from '../country/country.entity';
import { Dietary } from '../dietary/dietary.entitry';
import { UserAllergy } from '../allergies/user_allergy.entity';
import { FoodCategory } from '../food-category/foodCategory.entity';
import { Cuisine } from '../cuisine/cuisine.entity';
import { Recipe } from '../library/recipe/recipe.entity';
import { EducationalContent } from '../library/educational/educational.entity';
import { Storage } from '../storage/storage.entity';
import { RecipeComponent } from '../library/recipe/recipe-component/recipe-component.entity';
import { Component } from '../library/recipe/component/component.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('HF_NUTRITION_HOST'),
  port: configService.get<number>('HF_NUTRITION_PORT'),
  username: configService.get<string>('HF_NUTRITION_USERNAME'),
  password: configService.get<string>('HF_NUTRITION_PASSWORD'),
  database: configService.get<string>('HF_NUTRITION_DATABASE'),
  entities: [
    User, Country, Dietary, UserAllergy, FoodCategory, Cuisine, Recipe,
    EducationalContent, Storage, RecipeComponent, Component,
  ],
  synchronize: true,
});
