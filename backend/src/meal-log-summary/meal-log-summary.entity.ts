import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('meal_log_summary')
export class MealLogSummary{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'date'})
    date: Date;

    @Column({type: "json"})
    remaining_nutrients: JSON
    
    @Column({type: 'json', default: {}})
    food_consumed: JSON;

    @ManyToOne(()=> User, user=> user.user_id)
    @JoinColumn({name: 'user_id'})
    user: User;

}