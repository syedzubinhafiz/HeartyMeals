import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("food_category")
export class FoodCategory{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar'})
    type: string 
}