import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ethnicity')
export class Ethnicity{

    

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', nullable: false, unique: true})
    name: string;   

}