import { FoodCategory } from "src/food-category/foodCategory.entity";
import { User } from "src/user/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

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
}