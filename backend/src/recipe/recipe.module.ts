import { RecipeComponentService } from '../recipe-component/recipe-component.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuisine } from 'src/cuisine/cuisine.entity';
import { Dietary } from 'src/dietary/dietary.entity';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { User } from 'src/user/user.entity';
import { Component } from '../component/component.entity';
import { RecipeComponent } from '../recipe-component/recipe-component.entity';
import { CommonService } from 'src/common/common.service';
import { ComponentModule } from 'src/component/component.module';
import { RecipeComponentArchiveService } from 'src/recipe-component-archive/recipe-component-archive.service';
import { UserAllergy } from 'src/allergy/user_allergy.entity';
import { Recipe } from './recipe.entity';
import { StorageService } from 'src/storage/storage.service';
import { Country } from 'src/country/country.entity';
import { Ethnicity } from 'src/ethnicity/ethnicity.entity';
import { Storage } from 'src/storage/storage.entity';
import { RecipeOfTheDay } from './recipe-of-the-day.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cuisine, Dietary, User, Component, RecipeComponent, Recipe, UserAllergy, Storage, User, Country, Dietary, Ethnicity, RecipeOfTheDay]), ComponentModule],
    controllers: [RecipeController],
    providers: [RecipeService, RecipeComponentService, CommonService, RecipeComponentArchiveService, StorageService],
})
export class RecipeModule {}
