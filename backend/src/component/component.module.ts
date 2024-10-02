import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { FoodCategory } from 'src/food-category/foodCategory.entity';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/user/user.entity';
import { UserAllergy } from 'src/allergy/user_allergy.entity';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { Country } from 'src/country/country.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { RecipeComponent } from 'src/recipe-component/recipe-component.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { StorageService } from 'src/storage/storage.service';
import { Storage } from 'src/storage/storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Component, FoodCategory, User, UserAllergy, Cuisine, Dietary, RecipeComponent, Recipe, UserAllergy, Storage, Country, Ethnicity])],
  providers: [ComponentService, CommonService, StorageService],
  controllers: [ComponentController]
})
export class ComponentModule {}
