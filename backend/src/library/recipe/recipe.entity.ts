import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Visibility } from "./visibility.enum";
import { User } from "src/user/user.entity";
import { Cuisine } from "src/cuisine/cuisine.entity";
import { Dietary } from "src/dietary/dietary.entitry";


@Entity('recipe')
export class Recipe{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'varchar'})
    description: string;

    @Column({type: 'json'})
    instruction: JSON;

    @Column({type: 'integer'})
    serving_size: number;

    @Column({type: 'json'})
    nutrition_info: object;
    
    
    @Column({type: 'json'})
    recommended_meal_time: object;

    @Column({
        type: 'bool',
        default: false
    })
    is_approved: boolean;

    @Column({
        type: 'enum',
        enum: Visibility,
        default: Visibility.PRIVATE
    })
    visibility: Visibility;

    @Column({
        type: 'json', 
        default: {}
    })
    storage_links: JSON

    @ManyToOne( ()=> User, user=> user.user_id, {nullable: true} )
    @JoinColumn({name: 'user_id'})
    user: User;


    @ManyToOne( ()=> Cuisine, cuisine=> cuisine.id, {eager: true})
    @JoinColumn({name: 'cuisine_id'})
    cuisine: Cuisine;


    @ManyToOne( ()=> Dietary, dietary=>dietary.id, {eager: true})
    @JoinColumn({name: 'dietary_id'})
    dietary: Dietary;
}