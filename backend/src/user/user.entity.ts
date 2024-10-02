import { Country } from "src/country/country.entity";
import { Dietary } from "src/dietary/dietary.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "./enum/user-role.enum";
import { Gender } from "./enum/gender.enum";
import { Ethnicity } from "src/ethnicity/ethnicity.entity";
import { CholesterolLevel } from "./enum/cholesterol.enum";

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
    @Column({type: "float"})
    height: number;


    //weight in kg
    @Column({type: "float"})
    weight: number;


    /**
    {
        carbs_percentage: 0.5, //range from 0 to 1
        protein_percentage: 0.3, //range from 0 to 1
        fat_percentage: 0.2, //range from 0 to 1
        cholesterol_level: Normal, //Normal, High, Low
        activity_level: 1, {
            1: sedentary (less than 1 session of 30 minute exercise per week), 
            2: light (1-2 sessions of 30 minute exercise per week), 
            3: moderate (3-4 sessions of 30 minute exercise per week), 
            4: active (5-6 sessions of 30 minute exercise per week), 
            5: very active (more than 7 sessions of 30 minute exercise per week, active athlete, or job requires physical activity), 
        }
    }
     */
    @Column({
        type: 'jsonb', 
        nullable: false, 
        default: {
            'carbs_percentage': 0.5,
            'protein_percentage': 0.3,
            'fat_percentage': 0.2,
            'cholesterol_level': CholesterolLevel.NORMAL,
            'activity_level': 1
        }
    })
    user_nutrition_setting: Object;

    @Column({
        type: 'jsonb', 
        nullable: false, 
        default: {
            "calories": 0, //in cal
            "carbs": 0, //in g
            "protein": 0, //in g
            "fat": 0, //in g
            "sodium": 0, //in mg
            "cholesterol": 0, //in mg
            "water_intake": 0 //in ml
        }
    })
    daily_budget: Object;

    @CreateDateColumn({ type: "timestamp with time zone" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at: Date;

    @DeleteDateColumn({ type: "timestamp with time zone", nullable: true })
    deleted_at?: Date;

    
}