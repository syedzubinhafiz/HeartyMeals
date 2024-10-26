import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ComponentType } from "./enum/type.enum";
import { MeasuringUnit } from "./enum/measuring-unit.enum";
import { FoodCategory } from "src/food-category/foodCategory.entity";

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

    @Column({type: 'jsonb'})
    nutrition_info: Record<string, any>;
    
    @Column({
        type: 'enum',
        enum: MeasuringUnit
    })
    unit: MeasuringUnit;

    @Column({type: 'float'})
    amount: number;

    @Column({
        type: 'jsonb', 
        default: {
            'thumbnail': '',
            'content': {}
        }
    })
    storage_links: Record<string, any>; 

    @ManyToOne(()=> FoodCategory, foodCategory=>foodCategory.id, {eager: true})
    @JoinColumn({name: 'food_cat_id'})
    foodCategory: FoodCategory

}