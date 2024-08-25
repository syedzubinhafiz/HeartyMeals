import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { FoodCategory } from 'src/food-category/foodCategory.entity';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/user/user.entity';
import { UserAllergy } from 'src/allergy/user_allergy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Component, FoodCategory, User, UserAllergy])],
  providers: [ComponentService, CommonService],
  controllers: [ComponentController]
})
export class ComponentModule {}
