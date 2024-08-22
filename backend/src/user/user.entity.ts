import { Country } from "src/country/country.entity";
import { Dietary } from "src/dietary/dietary.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "./enum/user-role.enum";
import { Gender } from "./enum/gender.enum";
import { Ethnicity } from "src/ethnicity/ethnicity.entity";

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


    @ManyToOne( () => Ethnicity, ethnicity => ethnicity.id, {eager : true, nullable: true})
    @JoinColumn({name: 'ethnicity_id'})
    ethnicity: Ethnicity;

    @Column({type: "integer", nullable: true})
    nyha_level: number


    @Column({type: "jsonb"})
    medical_info: JSON;


    @Column({
        type: 'enum',
        enum: UserRole
    })
    user_role: UserRole;


    @CreateDateColumn({ type: "timestamp with time zone" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at: Date;

    @DeleteDateColumn({ type: "timestamp with time zone", nullable: true })
    deleted_at?: Date;

    
}