import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { Cuisine } from 'src/cuisine/cuisine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Component, Cuisine])],
  providers: [ComponentService],
  controllers: [ComponentController]
})
export class ComponentModule {}
