import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Visibility } from "./enum/visibility.enum";
import { User } from "src/user/user.entity";
import { Cuisine } from "src/cuisine/cuisine.entity";
import { Dietary } from "src/dietary/dietary.entity";


@Entity('recipe')
export class Recipe{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'varchar'})
    description: string;

    @Column({
        type: 'varchar',
        default: "0 minutes"
    })
    preparation_time: string;

    @Column('text', { array: true })
    instruction: string[];

    @Column({type: 'float'})
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

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}