import { Component } from "src/component/component.entity";
import { Recipe } from "src/recipe/recipe.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('recipe_component_archive')
export class RecipeComponentArchive {


    @PrimaryColumn()
    component_id: string;

    @PrimaryColumn()
    recipe_id: string 

    @Column({type: 'float'})
    amount: number;
    
    @ManyToOne( ()=> Component, component=> component.id, {eager: true})
    @JoinColumn({name: 'component_id'})
    component: Component;

    @ManyToOne(()=> Recipe, recipe=> recipe.id, {eager: true})
    @JoinColumn({name: 'recipe_id'})
    recipe: Recipe;

    
}