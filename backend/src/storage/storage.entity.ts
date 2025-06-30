import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StorageType } from "./enum/storage.enum";

@Entity("storage")
export class Storage{

    @PrimaryGeneratedColumn('uuid')
    storage_id: string;

    // path
    @Column({type: 'varchar', nullable: true})
    file_path: string;

    @Column({
        type: 'enum',
        enum: StorageType
    })
    type: StorageType;

    @Column({type: 'integer'})
    size: number

    // link
    @Column({type: 'varchar', nullable: true})
    link: string;

    @Column({type: 'bytea', nullable: true})
    data: Buffer;
}