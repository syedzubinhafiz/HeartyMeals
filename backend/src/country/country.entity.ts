import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("country")
export class Country{

    @PrimaryColumn()
    id: string;

    @Column({type : "varchar"})
    name: string

}