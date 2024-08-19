import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}