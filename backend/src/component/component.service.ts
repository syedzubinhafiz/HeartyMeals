import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from './component.entity';
import { In, Repository } from 'typeorm';
import { AddComponentDTO } from './dto/add-component-dto';
import { Cuisine } from 'src/cuisine/cuisine.entity';

@Injectable()
export class ComponentService {

    constructor(
        @InjectRepository(Component)
        private componentRepository: Repository<Component>,
        @InjectRepository(Cuisine)
        private cuisineRepository: Repository<Cuisine>
    ){}   

    async add(payload: AddComponentDTO) {

        const new_component =  new Component();
        const selected_cuisine =  await this.cuisineRepository.findOneBy({id: payload.cuisineId});

        if (selected_cuisine == null){
            return new HttpException("Cuisine not found", 400);
        }
        
        new_component.name = payload.name;
        new_component.component_type = payload.componentType;
        new_component.nutrition_info = payload.nutritionInformation;
        new_component.units = payload.units;
        new_component.amount = payload.amount;
        new_component.cuisine = selected_cuisine;


        //TODO: Add storage links
        new_component.storage_links = JSON.parse("{}");

        try{
            await this.componentRepository.save(new_component);
        } catch {
            return new HttpException("Error saving component", 400);
        }

        return new HttpException("Component added successfully", 200);
    }
}
