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

    @Column({type: "integer"})
    age: number;

    //height in cm
    @Column({type: "integer"})
    height: number;


    //weight in kg
    @Column({type: "integer"})
    weight: number;


    /**
    {
        carbs_percentage: 0.5, //range from 0 to 1
        protein_percentage: 0.3, //range from 0 to 1
        fat_percentage: 0.2, //range from 0 to 1
        activity_level: 1, {1: sedentary, 2: light, 3: moderate, 4: active, 5: very active}
        water_intake: 2000, // in ml    

    }
     */
    @Column({
        type: 'jsonb', 
        nullable: false, 
        default: {
            'carbs_percentage': 0.5,
            'protein_percentage': 0.3,
            'fat_percentage': 0.2,
            'activity_level': 1,
            'water_intake': 2000
        }
    })
    user_nutrition_setting: JSON;

    @Column({
        type: 'jsonb', 
        nullable: false, 
        default: {
            "calories": 0, //in kcal
            "carbs": 0, //in g
            "protein": 0, //in g
            "fat": 0, //in g
            "sodium": 0, //in mg
            "cholesterol": 0, //in mg
        }
    })
    nutrition_budget: JSON;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp with time zone", nullable: true })
    deletedAt?: Date;

    
}