import { Country } from "src/country/country.entity";
import { Dietary } from "src/dietary/dietary.entitry";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "./enum/user-role.enum";
import { Gender } from "./enum/gender.enum";

@Entity('user')   
export class User{

    @PrimaryColumn({type: "uuid"} )
    user_id: string;

    @Column({type: "varchar"})
    first_name: string;

    @Column({type: "varchar"})
    last_name: string;

    @Column({type: "varchar"})
    email: string; 

    @Column({
        type: "enum",
        enum: Gender
    })
    gender: Gender;
    
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


    @CreateDateColumn({ type: "timestamp with time zone" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp with time zone", nullable: true })
    deletedAt?: Date;

    
}