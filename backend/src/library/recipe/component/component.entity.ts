import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ComponentType } from "./type.enum";
import { MeasuringUnit } from "./measuring-unit.entity";
import { Cuisine } from "src/cuisine/cuisine.entity";

@Entity('component')
export class Component{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar'})
    name: string;

    @Column({
        type: 'enum',
        enum: ComponentType
    })
    component_type :ComponentType;

    @Column({type: 'json'})
    nutrition_info: JSON;

    @Column({
        type: 'enum',
        enum: MeasuringUnit
    })
    units: MeasuringUnit;

    @Column({type: 'integer'})
    amount: number;

    @Column({type:'json'})
    storage_links: JSON;

    @ManyToOne(()=> Cuisine, cuisine=>cuisine.id, {eager: true})
    @JoinColumn({name: 'cuisine_id'})
    cuisine: Cuisine
}