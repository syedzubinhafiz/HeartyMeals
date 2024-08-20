import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { MealType } from "../meal-type.enum";
import { User } from "src/user/user.entity";
import { Recipe } from "src/library/recipe/recipe.entity";

@Entity('meal_logging')
export class MealLogging{

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({type: 'date'})
    date: Date;

    @Column({type: 'timestamp with time zone'})
    time: Timestamp;

    @Column({
        type: 'enum',
        enum: MealType
    })
    type: MealType;

    @Column({
        type: 'boolean',
        default: false
    })
    is_consumed: boolean = false;

    @ManyToOne(()=> User, user=> user.user_id)
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(()=> Recipe, recipe=> recipe.id)
    @JoinColumn({name: 'recipe_id'})
    recipe: Recipe;

    @Column({type: 'timestamp with time zone'})
    createdAt: Date;
    
    @Column({type: 'timestamp with time zone'})
    updatedAt: Date;

    @Column({type: 'timestamp with time zone', nullable: true})
    deletedAt?: Date;
}