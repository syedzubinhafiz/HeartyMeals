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
import { UserAllergy } from 'src/allergy/user_allergy.entity';
import { RecipeComponentArchiveService } from 'src/recipe-component-archive/recipe-component-archive.service';
import { Recipe } from './recipe.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cuisine, Dietary, User, Component, RecipeComponent, Recipe, UserAllergy]), ComponentModule],
    controllers: [RecipeController],
    providers: [RecipeService, RecipeComponentService, CommonService, RecipeComponentArchiveService],
})
export class RecipeModule {}
