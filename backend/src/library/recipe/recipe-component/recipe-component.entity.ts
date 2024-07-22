import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Component } from "../component/component.entity";
import { Recipe } from "../recipe.entity";

@Entity('recipe_component')
export class RecipeComponent{

    @PrimaryColumn()
    component_id: string;

    @PrimaryColumn()
    recipe_id: string 

    @Column({type: 'integer'})
    amount: number;

    @ManyToOne( ()=> Component, component=> component.id, {eager: true})
    @JoinColumn({name: 'component_id'})
    component: Component;

    @ManyToOne(()=> Recipe, recipe=> recipe.id, {eager: true})
    @JoinColumn({name: 'recipe_id'})
    recipe: Recipe;

}
