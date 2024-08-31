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
    
    /**
     * @description: This field will store the food consumed by the user in the form of a JSON object
     * The JSON object will have the following structure:
     * @example
     * {
     * "Breakfast": [],
     * "Lunch": [],
     * "Dinner": [],
     * "Other": []
     * }
     */
    @Column({type: 'json', default: {}})
    food_consumed: Object;

    @ManyToOne(()=> User, user=> user.user_id)
    @JoinColumn({name: 'user_id'})
    user: User;

}