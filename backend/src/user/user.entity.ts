import { Country } from "src/country/country.entity";
import { Dietary } from "src/dietary/dietary.entitry";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./enum/user-role.enum";

@Entity('user')   
export class User{

    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({type: "varchar"})
    gsh_user_id: string;

    @Column({type: "varchar"})
    name: string;

    @Column({type: "varchar"})
    email: string;
    
    @ManyToOne( () => Country, country => country.id, {eager : true, nullable: true})
    @JoinColumn({name: 'country_id'})
    country: Country;

    @ManyToOne( () => Dietary, dietary => dietary.id, {eager : true, nullable: true})
    @JoinColumn({name: 'dietary_id'})
    dietary: Dietary;

    @Column({type: "integer", nullable: true})
    nyha_level: number


    @Column({type: "json"})
    medical_info: JSON;


    @Column({
        type: 'enum',
        enum: UserRole
    })
    user_role: UserRole;

    
}