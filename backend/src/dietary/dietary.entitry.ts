import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";


@Entity('dietary')
export class Dietary {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type : 'varchar'})
    name: string;
}