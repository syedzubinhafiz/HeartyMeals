import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Visibility } from "../recipe/enum/visibility.enum";

@Entity('educational_content')
export class EducationalContent{


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'varchar'})
    title: string 
    
    @Column({type: 'json'})
    content: Array<JSON>;

    @Column({
        type: 'json', 
        default: {
            'thumbnail': '',
            'content': {}
        }
    })
    storage_links: JSON;

    @Column({
        type: 'enum',
        enum: Visibility,
        default: Visibility.PUBLIC
    })
    visibility: Visibility;

    @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}