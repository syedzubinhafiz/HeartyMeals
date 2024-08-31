import { FoodCategory } from "src/food-category/foodCategory.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity("user_allergy")
export class UserAllergy{

    @PrimaryColumn()
    user_id: string;

    @PrimaryColumn()
    food_cat_id: string 

    @ManyToOne( () => User, user => user.user_id)
    @JoinColumn({name: 'user_id'})
    user: User

    @ManyToOne( () => FoodCategory, foodCategory => foodCategory.id)
    @JoinColumn({name: 'food_cat_id'})
    foodCategory: FoodCategory

    @Column({type: 'timestamp with time zone', default: () => 'now()'})
    created_at: Date;

    @Column({type: 'timestamp with time zone', nullable: true, default: null})
    deleted_at?: Date;

}