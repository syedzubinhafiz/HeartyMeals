import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { FoodCategory } from 'src/food-category/foodCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Component, FoodCategory])],
  providers: [ComponentService],
  controllers: [ComponentController]
})
export class ComponentModule {}
