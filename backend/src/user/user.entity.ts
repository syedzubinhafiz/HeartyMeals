import { Country } from "src/country/country.entity";
import { Dietary } from "src/dietary/dietary.entitry";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./enum/user-role.enum";

@Entity('user')   
export class User{

    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @ManyToOne( () => Country, country => country.id, {eager : true})
    @JoinColumn({name: 'id'})
    country: Country;

    @Column({type: "integer"})
    nyha_level: number

    @ManyToOne( () => Dietary, dietary => dietary.id, {eager : true})
    @JoinColumn({name: 'dietary_id'})
    dietary: Dietary;

    @Column({type: "json"})
    medical_info: JSON;


    @Column({
        type: 'enum',
        enum: UserRole
    })
    user_role: UserRole;
}