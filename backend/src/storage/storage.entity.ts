import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StorageType } from "./storage.enum";

@Entity("storage")
export class Storage{

    @PrimaryGeneratedColumn('uuid')
    storage_id: string;

    @Column({type: 'varchar'})
    file_path: string;

    @Column({
        type: 'enum',
        enum: StorageType
    })
    type: StorageType;

    @Column({type: 'integer'})
    size: number
}