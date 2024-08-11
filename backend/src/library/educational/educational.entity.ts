import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('educational_content')
export class EducationalContent{


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'varchar'})
    title: string 
    
    @Column({type: 'json'})
    content: Array<JSON>;

    @Column({type: 'json'})
    storage_links: JSON;

}