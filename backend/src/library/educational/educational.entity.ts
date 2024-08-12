import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Visibility } from "../recipe/visibility.enum";

@Entity('educational_content')
export class EducationalContent{


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'varchar'})
    title: string 
    
    @Column({type: 'json'})
    content: Array<JSON>;

    @Column({type: 'json', nullable: true})
    storage_links: JSON;

    @Column({
        type: 'enum',
        enum: Visibility,
        default: Visibility.PUBLIC
    })
    visibility: Visibility;
    // created at, deleted at, updated at, visibility enum, 
    // soft delete == deleted at not null + visibility = private
}