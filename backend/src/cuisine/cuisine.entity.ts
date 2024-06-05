import { Country } from "src/country/country.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('cuisine')
export class Cuisine{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:"varchar"})
    name: string;

    
    @Column({type: 'uuid'})  
    country_id: string; 

    @ManyToOne( () => Country, country => country.id, {eager: true})
    @JoinColumn({name: 'country_id'})
    country: Country;

}