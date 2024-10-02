import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StorageType } from "./enum/storage.enum";

@Entity("storage")
export class Storage{

    @PrimaryGeneratedColumn('uuid')
    storage_id: string;

    // path
    @Column({type: 'varchar'})
    file_path: string;

    @Column({
        type: 'enum',
        enum: StorageType
    })
    type: StorageType;

    @Column({type: 'integer'})
    size: number

    // link
    @Column({type: 'varchar'})
    link: string;
}